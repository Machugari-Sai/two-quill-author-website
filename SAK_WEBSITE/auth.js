const authStatus = document.querySelector("[data-auth-status]");
const profileView = document.querySelector("[data-profile-view]");
const reviewForm = document.querySelector("[data-review-form]");
const themeOptions = document.querySelector("[data-theme-options]");
const settingsStatus = document.querySelector("[data-settings-status]");

document.querySelectorAll(".brand").forEach((brand) => {
  brand.href = "/";
  brand.setAttribute("aria-label", "Back to Two Quill Stories");
});

const themes = {
  "royal-blue": { royal: "#09235f", royalLight: "#123c9f", navy: "#030b28", gold: "#f6c84c", deep: "#020718" },
  "imperial-purple": { royal: "#3b136f", royalLight: "#6d28d9", navy: "#190b31", gold: "#f6c84c", deep: "#090313" },
  "emerald-crown": { royal: "#064b3b", royalLight: "#047857", navy: "#031f22", gold: "#f6c84c", deep: "#020d0c" },
  "crimson-king": { royal: "#751717", royalLight: "#b91c1c", navy: "#260711", gold: "#f6c84c", deep: "#110306" },
  "sapphire-gold": { royal: "#06466b", royalLight: "#075985", navy: "#061f34", gold: "#ffd166", deep: "#020a12" },
  "ruby-throne": { royal: "#881337", royalLight: "#be123c", navy: "#2b0613", gold: "#f6c84c", deep: "#120309" },
  "garnet-crown": { royal: "#701a35", royalLight: "#9f1239", navy: "#270714", gold: "#ffd166", deep: "#100308" },
  "sunset-royal": { royal: "#7c2d12", royalLight: "#c2410c", navy: "#2f0d05", gold: "#ffd166", deep: "#120502" },
  "amber-palace": { royal: "#78350f", royalLight: "#b45309", navy: "#2c1303", gold: "#ffe696", deep: "#100702" },
  "gold-emperor": { royal: "#713f12", royalLight: "#a16207", navy: "#2a1704", gold: "#fff0a8", deep: "#0f0802" },
  "lime-regent": { royal: "#365314", royalLight: "#4d7c0f", navy: "#17240a", gold: "#f6c84c", deep: "#070d03" },
  "jade-kingdom": { royal: "#14532d", royalLight: "#15803d", navy: "#082412", gold: "#f6c84c", deep: "#020d07" },
  "teal-monarch": { royal: "#134e4a", royalLight: "#0f766e", navy: "#062422", gold: "#f6c84c", deep: "#020d0c" },
  "cyan-crown": { royal: "#155e75", royalLight: "#0891b2", navy: "#062633", gold: "#f6c84c", deep: "#020c12" },
  "azure-palace": { royal: "#075985", royalLight: "#0369a1", navy: "#062339", gold: "#ffd166", deep: "#020a14" },
  "indigo-royal": { royal: "#312e81", royalLight: "#4338ca", navy: "#11103a", gold: "#f6c84c", deep: "#050515" },
  "violet-majesty": { royal: "#581c87", royalLight: "#7e22ce", navy: "#210a36", gold: "#f6c84c", deep: "#080312" },
  "magenta-queen": { royal: "#86198f", royalLight: "#c026d3", navy: "#310934", gold: "#f6c84c", deep: "#100313" },
  "rose-palace": { royal: "#9f1239", royalLight: "#e11d48", navy: "#350816", gold: "#f6c84c", deep: "#120307" },
  "pearl-crown": { royal: "#334155", royalLight: "#64748b", navy: "#111827", gold: "#ffe696", deep: "#05070d" },
};

function applyTheme(themeName) {
  const theme = themes[themeName] || themes["royal-blue"];
  document.documentElement.style.setProperty("--royal", theme.royal);
  document.documentElement.style.setProperty("--royal-light", theme.royalLight);
  document.documentElement.style.setProperty("--navy", theme.navy);
  document.documentElement.style.setProperty("--gold", theme.gold);
  document.documentElement.style.setProperty("--deep", theme.deep);
}

applyTheme(localStorage.getItem("sakTheme") || "royal-blue");

function setStatus(message, type = "info") {
  if (!authStatus) return;
  authStatus.textContent = message;
  authStatus.dataset.type = type;
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw data;
  return data;
}

if (themeOptions) {
  const currentTheme = localStorage.getItem("sakTheme") || "royal-blue";
  themeOptions.querySelectorAll("[data-theme]").forEach((button) => {
    button.classList.toggle("active", button.dataset.theme === currentTheme);
    if (button.dataset.theme === currentTheme && settingsStatus) settingsStatus.textContent = `${button.textContent.trim()} is active.`;
    button.addEventListener("click", () => {
      localStorage.setItem("sakTheme", button.dataset.theme);
      applyTheme(button.dataset.theme);
      themeOptions.querySelectorAll("[data-theme]").forEach((item) => item.classList.toggle("active", item === button));
      if (settingsStatus) settingsStatus.textContent = `${button.textContent.trim()} is active.`;
    });
  });
}

if (reviewForm) {
  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(reviewForm);
    setStatus("Sending review...", "info");
    try {
      await postJson("/api/reviews", {
        rating: formData.get("rating"),
        review: formData.get("review"),
        changes: formData.get("changes"),
      });
      reviewForm.reset();
      setStatus("Thank you. Your review was saved.", "good");
    } catch (error) {
      setStatus(error.message || "Review failed.", "bad");
    }
  });
}

function formatDate(value) {
  if (!value) return "Not added";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

async function loadProfile() {
  if (!profileView) return;
  try {
    const data = await fetch("/api/profile").then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw payload;
      return payload;
    });
    const user = data.user;
    const profile = user.profile || {};
    const displayName = profile.name || user.email;
    profileView.innerHTML = `
      <div class="profile-hero-card">
        <div class="profile-avatar">${(profile.name || user.email || "S").slice(0, 1).toUpperCase()}</div>
        <div>
          <span>Registered SAK User</span>
          <h1>${displayName}</h1>
          <p>${user.email}</p>
        </div>
      </div>
      <div class="profile-grid">
        <div><span>Name</span><strong>${profile.name || "Not added"}</strong></div>
        <div><span>Gender</span><strong>${profile.gender || "Not added"}</strong></div>
        <div><span>Age</span><strong>${profile.age || "Not added"}</strong></div>
        <div><span>Date of Birth</span><strong>${formatDate(profile.dob)}</strong></div>
        <div><span>Email ID</span><strong>${user.email}</strong></div>
        <div><span>Joined</span><strong>${formatDate((user.createdAt || "").slice(0, 10))}</strong></div>
      </div>
    `;
  } catch (error) {
    profileView.innerHTML = `<div class="profile-error">${error.message || "Could not load profile."}</div>`;
  }
}

loadProfile();

document.querySelectorAll(".settings-logout").forEach((logoutLink) => {
  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = "index.html";
  });
});
