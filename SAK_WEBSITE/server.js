const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
// 8000 and 8001 are used by other local projects in this environment.
const port = Number(process.env.PORT) || 8010;
const host = process.env.HOST || "127.0.0.1";
const usersFile = path.join(root, "users.json");
const reviewsFile = path.join(root, "reviews.json");
const comicRatingsFile = path.join(root, "comic-ratings.json");
const sessionsFile = path.join(root, "sessions.json");
const flamesRoot = path.join(root, "SAK - 2[COMICS]");
const flamesFolderNames = new Set([
  "1.The Awakening",
  "2.The Seven Government Summit",
  "3. Shadows of the Old Kingdoms",
  "4.Return to Zytora",
  "5.The Elementos",
  "6.The Gathering Begins",
  "7. Frozen Hearts and Awakened Legacy",
  "8.The Battle Begins",
  "9.SABARICS  Flames of War",
  "10.The End of the Great War",
  "11.IC's Funeral",
]);
const sessions = new Map();
const authAttempts = new Map();
const sessionMaxAge = 60 * 60 * 24 * 30;
const secureCookie = process.env.NODE_ENV === "production" ? "; Secure" : "";
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const publicPages = new Set(["login.html", "register.html", "404.html"]);
const publicPrefixes = ["assets/", "tmp/"];
const publicFiles = new Set(["styles.css", "script.js", "auth.js"]);

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(usersFile, "utf8"));
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, encodedHash) {
  if (typeof encodedHash !== "string") return false;
  const [salt, storedHash] = encodedHash.split(":");
  if (!salt || !storedHash) return false;
  try {
    const actualHash = crypto.scryptSync(password, salt, 64);
    const expectedHash = Buffer.from(storedHash, "hex");
    return actualHash.length === expectedHash.length && crypto.timingSafeEqual(actualHash, expectedHash);
  } catch {
    return false;
  }
}

function migratePlaintextPasswords() {
  const users = readUsers();
  let changed = false;
  const migratedUsers = users.map((user) => {
    if (!user.password || user.passwordHash) return user;
    changed = true;
    const migratedUser = { ...user, passwordHash: hashPassword(user.password) };
    delete migratedUser.password;
    return migratedUser;
  });
  if (changed) writeUsers(migratedUsers);
}

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return [];
  }
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function loadSessions() {
  const savedSessions = readJsonFile(sessionsFile);
  const now = Date.now();
  savedSessions.forEach((session) => {
    if (session.id && session.user && session.expiresAt && new Date(session.expiresAt).getTime() > now) {
      sessions.set(session.id, session.user);
    }
  });
}

function saveSessions() {
  const expiresAt = new Date(Date.now() + sessionMaxAge * 1000).toISOString();
  const savedSessions = [...sessions.entries()].map(([id, user]) => ({ id, user, expiresAt }));
  writeJsonFile(sessionsFile, savedSessions);
}

function createSession(response, user) {
  const sessionId = crypto.randomBytes(32).toString("hex");
  sessions.set(sessionId, { id: user.id, email: user.email });
  saveSessions();
  response.setHeader("Set-Cookie", `sak_session=${sessionId}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionMaxAge}${secureCookie}`);
}

function allowAuthAttempt(request, identity) {
  const now = Date.now();
  const key = `${request.socket.remoteAddress || "unknown"}:${identity}`;
  const recent = (authAttempts.get(key) || []).filter((timestamp) => now - timestamp < 15 * 60 * 1000);
  if (recent.length >= 12) {
    authAttempts.set(key, recent);
    return false;
  }
  recent.push(now);
  authAttempts.set(key, recent);
  return true;
}

function sendJson(response, status, payload) {
  response.writeHead(status, { ...securityHeaders, "Content-Type": types[".json"] });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) request.destroy();
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .filter(([key, value]) => key && value)
  );
}

function getSessionUser(request) {
  const cookies = parseCookies(request.headers.cookie);
  const sessionId = cookies.sak_session;
  return sessionId ? sessions.get(sessionId) : null;
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role || "customer",
    createdAt: user.createdAt,
    profile: user.profile || {},
  };
}

function collectComicPages(folderPath, relativePath = "") {
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  const pages = [];
  entries.forEach((entry) => {
    const entryPath = path.join(folderPath, entry.name);
    const entryRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      pages.push(...collectComicPages(entryPath, entryRelativePath));
    } else if (entry.isFile() && /\.(png|jpe?g|webp|gif)$/i.test(entry.name)) {
      pages.push(entryRelativePath);
    }
  });
  return pages.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
}

function getAdminUser(request) {
  const sessionUser = getSessionUser(request);
  if (!sessionUser) return null;
  const user = readUsers().find((item) => item.id === sessionUser.id);
  return user && user.role === "admin" ? user : null;
}

function isPublicPath(relativePath) {
  return publicPages.has(relativePath) || publicFiles.has(relativePath) || publicPrefixes.some((prefix) => relativePath.startsWith(prefix));
}

async function handleApi(request, response, requestPath) {
  if (request.method === "GET" && requestPath === "/api/flames-of-war") {
    const sessionUser = getSessionUser(request);
    if (!sessionUser) {
      sendJson(response, 401, { ok: false, message: "Login required." });
      return;
    }

    let folders = [];
    try {
      const nestedFolders = fs.existsSync(flamesRoot)
        ? fs.readdirSync(flamesRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory())
        : [];
      const nestedWithImages = nestedFolders.filter((entry) => fs.readdirSync(path.join(flamesRoot, entry.name)).some((file) => /\.(png|jpe?g|webp|gif)$/i.test(file)));
      const sourceRoot = nestedWithImages.length ? flamesRoot : root;
      folders = fs.readdirSync(sourceRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && (sourceRoot !== root || flamesFolderNames.has(entry.name)))
        .map((entry) => {
          const folderPath = path.join(sourceRoot, entry.name);
          const pages = collectComicPages(folderPath);
          return { name: entry.name, pages, basePath: sourceRoot === root ? "" : path.relative(root, sourceRoot) };
        })
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
    } catch {
      sendJson(response, 500, { ok: false, message: "Flames of War comics folder could not be read." });
      return;
    }

    sendJson(response, 200, { ok: true, folders });
    return;
  }

  if (requestPath === "/api/admin/dashboard" && request.method === "GET") {
    const admin = getAdminUser(request);
    if (!admin) {
      sendJson(response, getSessionUser(request) ? 403 : 401, { ok: false, message: "Administrator access required." });
      return;
    }

    const users = readUsers();
    const reviews = readJsonFile(reviewsFile);
    const ratings = readJsonFile(comicRatingsFile);
    const recentUsers = users
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8)
      .map(publicUser);
    const recentReviews = reviews
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8);

    sendJson(response, 200, {
      ok: true,
      admin: publicUser(admin),
      metrics: {
        customers: users.filter((user) => user.role !== "admin").length,
        totalUsers: users.length,
        reviews: reviews.length,
        comicRatings: ratings.length,
        averageReviewRating: reviews.length ? Number((reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length).toFixed(1)) : 0,
      },
      recentUsers,
      recentReviews,
      recentRatings: ratings.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8),
    });
    return;
  }

  if (request.method === "POST" && requestPath === "/api/register") {
    const body = await readBody(request);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim();
    const gender = String(body.gender || "").trim();
    const dob = String(body.dob || "").trim();
    const birthDate = new Date(`${dob}T00:00:00`);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age -= 1;

    if (!allowAuthAttempt(request, email || "register")) {
      sendJson(response, 429, { ok: false, message: "Too many attempts. Please try again later." });
      return;
    }

    if (!email.includes("@") || email.length > 254 || password.length < 4 || password.length > 200) {
      sendJson(response, 400, { ok: false, message: "Enter a valid email and a password with at least 4 characters." });
      return;
    }

    if (!name || name.length > 80 || !["male", "female"].includes(gender) || !dob || Number.isNaN(birthDate.getTime()) || !Number.isInteger(age) || age < 1 || age > 120) {
      sendJson(response, 400, { ok: false, message: "Complete name, gender, and a valid date of birth." });
      return;
    }

    const users = readUsers();
    if (users.some((user) => user.email === email)) {
      sendJson(response, 409, { ok: false, message: "This email is already registered. Log in now." });
      return;
    }

    const user = {
      id: crypto.randomUUID(),
      email,
      passwordHash: hashPassword(password),
      profile: {
        name,
        gender,
        age,
        dob,
      },
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeUsers(users);
    createSession(response, user);
    sendJson(response, 201, { ok: true, message: "Registration complete. Entering the SAK Universe.", redirect: "/index.html", user: publicUser(user) });
    return;
  }

  if (request.method === "GET" && requestPath === "/api/profile") {
    const sessionUser = getSessionUser(request);
    if (!sessionUser) {
      sendJson(response, 401, { ok: false, message: "Login required." });
      return;
    }

    const user = readUsers().find((item) => item.id === sessionUser.id);
    if (!user) {
      sendJson(response, 404, { ok: false, message: "Profile not found." });
      return;
    }

    sendJson(response, 200, { ok: true, user: publicUser(user) });
    return;
  }

  if (request.method === "POST" && requestPath === "/api/reviews") {
    const sessionUser = getSessionUser(request);
    if (!sessionUser) {
      sendJson(response, 401, { ok: false, message: "Login required." });
      return;
    }

    const body = await readBody(request);
    const rating = Number(body.rating);
    const review = String(body.review || "").trim();
    const changes = String(body.changes || "").trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !review || review.length > 5000 || !changes || changes.length > 5000) {
      sendJson(response, 400, { ok: false, message: "Add a rating, review, and changes you want." });
      return;
    }

    const reviews = readJsonFile(reviewsFile);
    reviews.push({
      id: crypto.randomUUID(),
      userId: sessionUser.id,
      email: sessionUser.email,
      rating,
      review,
      changes,
      createdAt: new Date().toISOString(),
    });
    writeJsonFile(reviewsFile, reviews);
    sendJson(response, 201, { ok: true, message: "Thank you for reviewing the website." });
    return;
  }

  if (request.method === "POST" && requestPath === "/api/comic-ratings") {
    const sessionUser = getSessionUser(request);
    if (!sessionUser) {
      sendJson(response, 401, { ok: false, message: "Login required." });
      return;
    }

    const body = await readBody(request);
    const comicId = String(body.comicId || "").trim();
    const comicTitle = String(body.comicTitle || "").trim();
    const rating = Number(body.rating);
    const note = String(body.note || "").trim();

    if (!comicId || comicId.length > 200 || comicTitle.length > 300 || !Number.isInteger(rating) || rating < 1 || rating > 5 || !note || note.length > 5000) {
      sendJson(response, 400, { ok: false, message: "Choose a comic rating and write your review." });
      return;
    }

    const ratings = readJsonFile(comicRatingsFile);
    ratings.push({
      id: crypto.randomUUID(),
      userId: sessionUser.id,
      email: sessionUser.email,
      comicId,
      comicTitle,
      rating,
      note,
      createdAt: new Date().toISOString(),
    });
    writeJsonFile(comicRatingsFile, ratings);
    sendJson(response, 201, { ok: true, message: "Comic rating saved." });
    return;
  }

  if (request.method === "POST" && requestPath === "/api/login") {
    const body = await readBody(request);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!allowAuthAttempt(request, email || "login")) {
      sendJson(response, 429, { ok: false, message: "Too many attempts. Please try again later." });
      return;
    }

    const user = readUsers().find((item) => item.email === email);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      sendJson(response, 401, { ok: false, message: "Email or password is wrong." });
      return;
    }

    createSession(response, user);
    response.writeHead(200, { ...securityHeaders, "Content-Type": types[".json"] });
    response.end(JSON.stringify({ ok: true, message: "Login successful.", redirect: "/index.html", user: publicUser(user) }));
    return;
  }

  sendJson(response, 404, { ok: false, message: "API route not found." });
}

http
  .createServer(async (request, response) => {
    try {
      const requestPath = decodeURIComponent(request.url.split("?")[0]);

      if (requestPath.startsWith("/api/")) {
        await handleApi(request, response, requestPath);
        return;
      }

      if (requestPath === "/logout") {
        const cookies = parseCookies(request.headers.cookie);
        if (cookies.sak_session) {
          sessions.delete(cookies.sak_session);
          saveSessions();
        }
        response.writeHead(302, {
          ...securityHeaders,
          Location: "/login.html",
          "Set-Cookie": `sak_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secureCookie}`,
        });
        response.end();
        return;
      }

      const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
      const filePath = path.resolve(root, relativePath);
      const sessionUser = getSessionUser(request);

      if (!filePath.startsWith(root + path.sep) && filePath !== path.join(root, "index.html")) {
        response.writeHead(403, securityHeaders).end("Forbidden");
        return;
      }

      if (sessionUser && publicPages.has(relativePath)) {
        response.writeHead(302, { ...securityHeaders, Location: "/index.html" });
        response.end();
        return;
      }

      if (fs.existsSync(filePath) && !isPublicPath(relativePath) && path.extname(relativePath) === ".html" && !sessionUser) {
        response.writeHead(302, { ...securityHeaders, Location: "/login.html" });
        response.end();
        return;
      }

      fs.readFile(filePath, (error, content) => {
        if (error) {
          if (error.code === "ENOENT") {
            fs.readFile(path.join(root, "404.html"), (notFoundError, notFoundContent) => {
              if (notFoundError) {
                response.writeHead(404, securityHeaders).end("Not found");
                return;
              }
              response.writeHead(404, { ...securityHeaders, "Content-Type": types[".html"] });
              response.end(notFoundContent);
            });
            return;
          }
          response.writeHead(500, securityHeaders).end("Server error");
          return;
        }
      response.writeHead(200, { ...securityHeaders, "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
        response.end(content);
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        sendJson(response, 400, { ok: false, message: "Request body must be valid JSON." });
        return;
      }
      response.writeHead(500, { ...securityHeaders, "Content-Type": types[".json"] });
      response.end(JSON.stringify({ ok: false, message: "Server error." }));
    }
  })
  .listen(port, host, () => {
    console.log(`SAK Universe auth server is running at http://${host}:${port}/`);
  });

migratePlaintextPasswords();
loadSessions();
