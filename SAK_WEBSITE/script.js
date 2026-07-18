const intro = document.getElementById("intro");
const site = document.getElementById("site");
const skipButton = document.getElementById("skipIntro");
const heroArt = document.getElementById("heroArt");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
function arrangeTopNavigation() {
  const nav = document.querySelector(".nav-wrap");
  const links = nav?.querySelector(".nav-links");
  const actions = nav?.querySelector(".nav-actions");
  if (!links || !actions) return;
  const profile = [...links.querySelectorAll("a")].find((link) => link.getAttribute("href") === "profile.html");
  const review = actions.querySelector('a[href="review.html"]');
  links.querySelectorAll('a[href="settings.html"]').forEach((link) => link.remove());
  if (profile) {
    profile.classList.add("nav-cta");
    actions.appendChild(profile);
  }
  review?.remove();
}
arrangeTopNavigation();
const savedTheme = localStorage.getItem("sakTheme");
const themeMap = {
  "royal-blue": ["#09235f", "#123c9f", "#030b28", "#f6c84c", "#020718"],
  "imperial-purple": ["#3b136f", "#6d28d9", "#190b31", "#f6c84c", "#090313"],
  "emerald-crown": ["#064b3b", "#047857", "#031f22", "#f6c84c", "#020d0c"],
  "crimson-king": ["#751717", "#b91c1c", "#260711", "#f6c84c", "#110306"],
  "sapphire-gold": ["#06466b", "#075985", "#061f34", "#ffd166", "#020a12"],
  "ruby-throne": ["#881337", "#be123c", "#2b0613", "#f6c84c", "#120309"],
  "garnet-crown": ["#701a35", "#9f1239", "#270714", "#ffd166", "#100308"],
  "sunset-royal": ["#7c2d12", "#c2410c", "#2f0d05", "#ffd166", "#120502"],
  "amber-palace": ["#78350f", "#b45309", "#2c1303", "#ffe696", "#100702"],
  "gold-emperor": ["#713f12", "#a16207", "#2a1704", "#fff0a8", "#0f0802"],
  "lime-regent": ["#365314", "#4d7c0f", "#17240a", "#f6c84c", "#070d03"],
  "jade-kingdom": ["#14532d", "#15803d", "#082412", "#f6c84c", "#020d07"],
  "teal-monarch": ["#134e4a", "#0f766e", "#062422", "#f6c84c", "#020d0c"],
  "cyan-crown": ["#155e75", "#0891b2", "#062633", "#f6c84c", "#020c12"],
  "azure-palace": ["#075985", "#0369a1", "#062339", "#ffd166", "#020a14"],
  "indigo-royal": ["#312e81", "#4338ca", "#11103a", "#f6c84c", "#050515"],
  "violet-majesty": ["#581c87", "#7e22ce", "#210a36", "#f6c84c", "#080312"],
  "magenta-queen": ["#86198f", "#c026d3", "#310934", "#f6c84c", "#100313"],
  "rose-palace": ["#9f1239", "#e11d48", "#350816", "#f6c84c", "#120307"],
  "pearl-crown": ["#334155", "#64748b", "#111827", "#ffe696", "#05070d"],
};
if (savedTheme && themeMap[savedTheme]) {
  const [royal, royalLight, navy, gold, deep] = themeMap[savedTheme];
  document.documentElement.style.setProperty("--royal", royal);
  document.documentElement.style.setProperty("--royal-light", royalLight);
  document.documentElement.style.setProperty("--navy", navy);
  document.documentElement.style.setProperty("--gold", gold);
  document.documentElement.style.setProperty("--deep", deep);
}
if (document.querySelector(".map-site, .map-feature")) {
  const mapStyles = document.createElement("link");
  mapStyles.rel = "stylesheet";
  mapStyles.href = "map.css";
  document.head.appendChild(mapStyles);
}

// Shared top-right universe navigation, shown consistently on every page.
const universeMenu = document.createElement("nav");
universeMenu.className = "universe-menu";
universeMenu.setAttribute("aria-label", "Universe information");
const heroesLink = [...document.querySelectorAll(".nav-links a")].find(
  (link) => link.getAttribute("href") === "heroes.html"
);
if (heroesLink) universeMenu.appendChild(heroesLink);
// Vercel serves these pages as static files, so the standalone Node server
// cannot protect HTML routes. Keep a lightweight client-side gate for the
// static deployment; the server-side checks still apply when server.js runs.
const pageName = location.pathname.split("/").pop() || "index.html";
const publicPages = new Set(["", "login.html", "register.html"]);
const hasClientSession = Boolean(localStorage.getItem("sak_client_session"));
// The Node server protects HTML routes with an HTTP-only cookie. The client
// fallback is only needed when the files are opened directly from disk.
if (location.protocol === "file:" && !publicPages.has(pageName) && !hasClientSession) {
  const next = `${location.pathname}${location.search}${location.hash}`;
  window.location.replace(`login.html?next=${encodeURIComponent(next)}`);
}

const universeLinks = [
  ["map.html", "Map"], ["teams.html", "Teams"],
  ["kingdoms.html", "Kingdoms"], ["government.html", "Government"],
];
const currentPage = location.pathname.split("/").pop() || "index.html";
universeLinks.forEach(([href, label]) => {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;
  if (currentPage === href) link.classList.add("active");
  universeMenu.appendChild(link);
});
document.querySelector(".nav-wrap")?.insertAdjacentElement("afterend", universeMenu);

function revealSite(skip = false) {
  if (skip) intro.classList.add("hidden");
  site.classList.add("visible");
  site.setAttribute("aria-hidden", "false");
  window.setTimeout(() => intro.remove(), skip ? 700 : 1000);
}

// Keep the welcome cinematic short so visitors reach the content quickly.
const introTimer = intro ? window.setTimeout(() => revealSite(), 2400) : null;

skipButton?.addEventListener("click", () => {
  window.clearTimeout(introTimer);
  revealSite(true);
});

document.addEventListener("pointermove", (event) => {
  if (!heroArt || window.innerWidth < 850) return;
  const x = (event.clientX / window.innerWidth - 0.5) * 14;
  const y = (event.clientY / window.innerHeight - 0.5) * -12;
  heroArt.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});

menuButton?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

navLinks?.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
});

const comicSeriesToggle = document.querySelector(".comic-series-toggle");
const comicSeriesLabels = document.getElementById("sak6aComicLabels");
if (comicSeriesToggle && comicSeriesLabels) {
  comicSeriesToggle.addEventListener("click", () => {
    const opened = comicSeriesLabels.toggleAttribute("hidden");
    comicSeriesToggle.setAttribute("aria-expanded", String(!opened));
    comicSeriesToggle.textContent = opened ? "Open comic labels ->" : "Hide comic labels";
    if (!opened) comicSeriesLabels.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

const comicArchives = {
  "master-mask": {
    id: "master-mask",
    title: "Master Mask Comic",
    folder: "1.THE MASTER MASK",
    pages: [
      "ChatGPT Image Jul 7, 2026, 12_26_36 AM.png", "ChatGPT Image Jul 7, 2026, 12_26_46 AM.png", "ChatGPT Image Jul 7, 2026, 12_26_50 AM.png", "ChatGPT Image Jul 7, 2026, 12_26_56 AM.png",
      "ChatGPT Image Jul 7, 2026, 12_26_59 AM.png", "ChatGPT Image Jul 7, 2026, 12_27_48 AM.png", "ChatGPT Image Jul 7, 2026, 12_27_51 AM.png", "ChatGPT Image Jul 7, 2026, 12_27_54 AM.png",
      "ChatGPT Image Jul 7, 2026, 12_27_58 AM.png", "ChatGPT Image Jul 7, 2026, 12_28_00 AM.png", "ChatGPT Image Jul 7, 2026, 12_28_02 AM.png", "ChatGPT Image Jul 7, 2026, 12_28_04 AM.png",
      "ChatGPT Image Jul 7, 2026, 12_28_23 AM.png", "ChatGPT Image Jul 7, 2026, 12_28_25 AM.png", "ChatGPT Image Jul 7, 2026, 12_28_27 AM.png", "ChatGPT Image Jul 7, 2026, 12_28_29 AM.png",
      "ChatGPT Image Jul 7, 2026, 12_28_32 AM.png", "ChatGPT Image Jul 7, 2026, 12_28_34 AM.png", "ChatGPT Image Jul 7, 2026, 12_28_36 AM.png", "ChatGPT Image Jul 7, 2026, 12_28_38 AM.png",
      "ChatGPT Image Jul 7, 2026, 12_28_41 AM.png", "ChatGPT Image Jul 7, 2026, 12_28_46 AM.png", "ChatGPT Image Jul 7, 2026, 12_29_00 AM.png", "ChatGPT Image Jul 7, 2026, 12_29_03 AM.png",
    ],
  },
  "ani-pows": {
    id: "ani-pows",
    title: "Ani Pow's Comic",
    folder: "2.THE ANI POW's",
    pages: [
      "ChatGPT Image Jul 7, 2026, 12_31_21 AM.png", "ChatGPT Image Jul 7, 2026, 12_31_43 AM.png", "ChatGPT Image Jul 7, 2026, 12_31_46 AM.png", "ChatGPT Image Jul 7, 2026, 12_32_06 AM.png",
      "ChatGPT Image Jul 7, 2026, 12_32_08 AM.png", "ChatGPT Image Jul 7, 2026, 12_32_10 AM.png", "ChatGPT Image Jul 7, 2026, 12_32_12 AM.png", "ChatGPT Image Jul 7, 2026, 12_32_16 AM.png",
      "ChatGPT Image Jul 7, 2026, 12_32_18 AM.png", "ChatGPT Image Jul 7, 2026, 12_32_20 AM.png", "ChatGPT Image Jul 7, 2026, 12_32_21 AM.png", "ChatGPT Image Jul 7, 2026, 12_32_24 AM.png",
      "ChatGPT Image Jul 7, 2026, 12_32_26 AM.png", "ChatGPT Image Jul 7, 2026, 12_32_28 AM.png", "ChatGPT Image Jul 7, 2026, 12_32_29 AM.png", "ChatGPT Image Jul 7, 2026, 12_32_31 AM.png",
      "ChatGPT Image Jul 7, 2026, 12_32_34 AM.png",
    ],
  },
  "rise-of-sabarics": {
    id: "rise-of-sabarics",
    title: "Rise of Sabarics Comic",
    folder: "3.THE RISE OF SABARICS",
    pages: [
      "ChatGPT Image Jul 7, 2026, 10_19_22 PM.png", "ChatGPT Image Jul 7, 2026, 10_19_25 PM.png", "ChatGPT Image Jul 7, 2026, 10_19_28 PM.png", "ChatGPT Image Jul 7, 2026, 10_19_30 PM.png",
      "ChatGPT Image Jul 7, 2026, 10_19_31 PM.png", "ChatGPT Image Jul 7, 2026, 10_19_33 PM.png", "ChatGPT Image Jul 7, 2026, 10_19_35 PM.png", "ChatGPT Image Jul 7, 2026, 10_19_37 PM.png",
      "ChatGPT Image Jul 7, 2026, 10_19_39 PM.png", "ChatGPT Image Jul 7, 2026, 10_19_46 PM.png", "ChatGPT Image Jul 7, 2026, 10_19_49 PM.png", "ChatGPT Image Jul 7, 2026, 10_19_52 PM.png",
      "ChatGPT Image Jul 7, 2026, 10_29_10 PM.png",
    ],
  },
  "dark-hero-racula": {
    id: "dark-hero-racula",
    title: "The Dark Hero Racula Comic",
    folder: "4.The Dark Hero Racula",
    pages: [
      "ChatGPT Image Jul 11, 2026, 06_33_00 PM.png", "ChatGPT Image Jul 11, 2026, 06_33_02 PM.png", "ChatGPT Image Jul 11, 2026, 06_33_04 PM.png", "ChatGPT Image Jul 11, 2026, 06_33_06 PM.png",
      "ChatGPT Image Jul 11, 2026, 06_33_07 PM.png", "ChatGPT Image Jul 11, 2026, 06_33_08 PM.png", "ChatGPT Image Jul 11, 2026, 06_33_12 PM.png", "ChatGPT Image Jul 11, 2026, 06_33_13 PM.png",
      "ChatGPT Image Jul 11, 2026, 06_33_14 PM.png", "ChatGPT Image Jul 11, 2026, 06_33_16 PM.png", "ChatGPT Image Jul 11, 2026, 06_33_18 PM.png", "ChatGPT Image Jul 11, 2026, 06_33_20 PM.png",
      "ChatGPT Image Jul 11, 2026, 06_52_08 PM.png",
    ],
  },
  "seven-governments": {
    id: "seven-governments",
    title: "The 7 Governments Comic",
    folder: "5.THE 7 GOVERNMENTS",
    pages: [
      "ChatGPT Image Jul 11, 2026, 06_14_15 PM.png", "ChatGPT Image Jul 11, 2026, 06_14_18 PM.png", "ChatGPT Image Jul 11, 2026, 06_14_20 PM.png", "ChatGPT Image Jul 11, 2026, 06_14_21 PM.png",
      "ChatGPT Image Jul 11, 2026, 06_14_23 PM.png", "ChatGPT Image Jul 11, 2026, 06_14_25 PM.png", "ChatGPT Image Jul 11, 2026, 06_23_56 PM.png",
    ],
  },
  "meeting": {
    id: "meeting",
    title: "The Meeting Comic",
    folder: "6.THE MEETING",
    pages: [
      "ChatGPT Image Jul 11, 2026, 06_15_59 PM.png", "ChatGPT Image Jul 11, 2026, 06_16_01 PM.png", "ChatGPT Image Jul 11, 2026, 06_16_03 PM.png", "ChatGPT Image Jul 11, 2026, 06_28_54 PM.png",
    ],
  },
  "lebyote": {
    id: "lebyote",
    title: "The Lebyote Comic",
    folder: "7.LEBYOTE",
    pages: [
      "ChatGPT Image Jul 11, 2026, 06_25_27 PM.png", "ChatGPT Image Jul 11, 2026, 06_25_31 PM.png", "ChatGPT Image Jul 11, 2026, 06_25_32 PM.png", "ChatGPT Image Jul 11, 2026, 06_25_33 PM.png",
      "ChatGPT Image Jul 11, 2026, 06_25_35 PM.png", "ChatGPT Image Jul 11, 2026, 06_25_36 PM.png", "ChatGPT Image Jul 11, 2026, 06_25_37 PM.png", "ChatGPT Image Jul 11, 2026, 06_25_38 PM.png",
      "ChatGPT Image Jul 11, 2026, 06_32_22 PM.png",
    ],
  },
  "lebyote-vs-heroes": {
    id: "lebyote-vs-heroes",
    title: "Lebyote vs The Heroes Comic",
    folder: "8.LEBYOTE VS THE HEROES",
    pages: [
      "ChatGPT Image Jul 11, 2026, 08_47_15 PM.png", "ChatGPT Image Jul 11, 2026, 08_47_18 PM.png", "ChatGPT Image Jul 11, 2026, 08_47_21 PM.png", "ChatGPT Image Jul 11, 2026, 08_47_23 PM.png",
      "ChatGPT Image Jul 11, 2026, 08_47_25 PM.png", "ChatGPT Image Jul 11, 2026, 08_47_27 PM.png", "ChatGPT Image Jul 11, 2026, 08_47_28 PM.png", "ChatGPT Image Jul 11, 2026, 08_47_30 PM.png",
      "ChatGPT Image Jul 11, 2026, 08_47_33 PM.png", "ChatGPT Image Jul 11, 2026, 08_48_03 PM.png", "ChatGPT Image Jul 11, 2026, 08_48_06 PM.png",
    ],
  },
  "lebyote-vs-master-mask": {
    id: "lebyote-vs-master-mask",
    title: "Lebyote vs Master Mask Comic",
    folder: "9.LEBYOTE VS MASTER MASK",
    pages: [
      "ChatGPT Image Jul 12, 2026, 11_33_36 PM.png", "ChatGPT Image Jul 12, 2026, 11_33_38 PM.png", "ChatGPT Image Jul 12, 2026, 11_33_39 PM.png", "ChatGPT Image Jul 12, 2026, 11_33_41 PM.png",
      "ChatGPT Image Jul 12, 2026, 11_33_42 PM.png", "ChatGPT Image Jul 12, 2026, 11_33_43 PM.png", "ChatGPT Image Jul 12, 2026, 11_33_45 PM.png", "ChatGPT Image Jul 12, 2026, 11_33_46 PM.png",
      "ChatGPT Image Jul 12, 2026, 11_33_47 PM.png", "ChatGPT Image Jul 12, 2026, 11_33_49 PM.png", "ChatGPT Image Jul 12, 2026, 11_33_50 PM.png", "ChatGPT Image Jul 12, 2026, 11_43_18 PM.png",
    ],
  },
};

const comicLinks = [...document.querySelectorAll("[data-comic]")];
if (comicLinks.length) {
  let activeComic = comicArchives[comicLinks[0].dataset.comic];
  let activeComicPage = 0;
  let comicTurning = false;

  const reader = document.createElement("div");
  reader.className = "comic-reader";
  reader.setAttribute("role", "dialog");
  reader.setAttribute("aria-modal", "true");
  reader.setAttribute("aria-hidden", "true");
  reader.innerHTML = `
    <div class="comic-reader-shell">
      <div class="comic-reader-bar">
        <div><span>Comic reader</span><strong>Page 01</strong></div>
        <button class="comic-reader-close" type="button" aria-label="Close comic reader">&times;</button>
      </div>
      <div class="comic-reader-stage">
        <figure class="comic-page-frame">
          <img alt="">
          <figcaption class="comic-page-missing"></figcaption>
        </figure>
      </div>
      <div class="comic-reader-controls">
        <button class="comic-prev" type="button">Previous</button>
        <span>1 / 44</span>
        <button class="comic-next" type="button">Next</button>
      </div>
    </div>`;
  document.body.appendChild(reader);

  const pageFrame = reader.querySelector(".comic-page-frame");
  const pageImage = reader.querySelector("img");
  const missingPage = reader.querySelector(".comic-page-missing");
  const pageTitle = reader.querySelector(".comic-reader-bar strong");
  const pageCount = reader.querySelector(".comic-reader-controls span");
  const prevButton = reader.querySelector(".comic-prev");
  const nextButton = reader.querySelector(".comic-next");
  const closeButton = reader.querySelector(".comic-reader-close");

  const renderComicPage = () => {
    if (!activeComic) return;
    const pageNumber = activeComicPage + 1;
    const pageSrc = `${activeComic.folder}/${activeComic.pages[activeComicPage]}`;
    pageFrame.classList.remove("is-missing");
    missingPage.textContent = "";
    pageTitle.textContent = `${activeComic.title} - Page ${String(pageNumber).padStart(2, "0")}`;
    pageCount.textContent = `${pageNumber} / ${activeComic.pages.length}`;
    pageImage.alt = `${activeComic.title} page ${pageNumber}`;
    pageImage.src = encodeURI(pageSrc);
    prevButton.disabled = activeComicPage === 0;
    nextButton.disabled = activeComicPage === activeComic.pages.length - 1;
  };

  const closeComicReader = () => {
    if (location.pathname.endsWith("/comic-reader.html") || location.pathname.endsWith("\\comic-reader.html")) {
      window.location.href = "sak-6a-beginning.html";
      return;
    }
    reader.classList.remove("open");
    reader.setAttribute("aria-hidden", "true");
    document.body.classList.remove("viewer-open");
  };

  const openComicReader = (comic) => {
    activeComic = comic;
    activeComicPage = 0;
    renderComicPage();
    reader.classList.add("open");
    reader.setAttribute("aria-hidden", "false");
    document.body.classList.add("viewer-open");
    nextButton.focus();
  };

  const turnComicPage = (direction) => {
    if (!activeComic) return;
    if (comicTurning) return;
    const nextPage = activeComicPage + direction;
    if (nextPage < 0 || nextPage >= activeComic.pages.length) return;
    comicTurning = true;
    reader.classList.add("page-is-turning");
    pageFrame.classList.add(direction > 0 ? "turning-next" : "turning-prev");
    window.setTimeout(() => {
      activeComicPage = nextPage;
      renderComicPage();
    }, 360);
    window.setTimeout(() => {
      pageFrame.classList.remove("turning-next", "turning-prev");
      reader.classList.remove("page-is-turning");
      comicTurning = false;
    }, 720);
  };

  pageImage.addEventListener("load", () => {
    pageFrame.classList.remove("is-missing");
    missingPage.textContent = "";
  });

  pageImage.addEventListener("error", () => {
    pageFrame.classList.add("is-missing");
    missingPage.textContent = activeComic
      ? `Image not found: ${activeComic.folder}/${activeComic.pages[activeComicPage]}`
      : "Comic image not found";
  });

  comicLinks.forEach((link) => link.addEventListener("click", (event) => {
    const comic = comicArchives[link.dataset.comic];
    if (!comic) return;
    event.preventDefault();
    openComicReader(comic);
  }));
  const requestedComicId = new URLSearchParams(window.location.search).get("comic");
  const requestedComic = requestedComicId && comicArchives[requestedComicId];
  if (requestedComic) window.setTimeout(() => openComicReader(requestedComic), 0);
  prevButton.addEventListener("click", () => turnComicPage(-1));
  nextButton.addEventListener("click", () => turnComicPage(1));
  closeButton.addEventListener("click", closeComicReader);
  reader.addEventListener("click", (event) => {
    if (event.target === reader) closeComicReader();
  });
  document.addEventListener("keydown", (event) => {
    if (!reader.classList.contains("open")) return;
    if (event.key === "Escape") closeComicReader();
    if (event.key === "ArrowRight") turnComicPage(1);
    if (event.key === "ArrowLeft") turnComicPage(-1);
  });
}

// Open Elementos character sheets without leaving the website.
const elementCards = document.querySelectorAll(".element-card[data-viewer]");
if (elementCards.length) {
  const viewer = document.createElement("div");
  viewer.className = "hero-viewer";
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-modal", "true");
  viewer.setAttribute("aria-hidden", "true");
  viewer.innerHTML = `
    <div class="hero-viewer-bar">
      <div><span>Elementos archive</span><strong></strong></div>
      <button type="button" aria-label="Close hero profile">×</button>
    </div>
    <div class="hero-viewer-stage"><img alt=""></div>`;
  document.body.appendChild(viewer);

  const viewerImage = viewer.querySelector("img");
  const viewerName = viewer.querySelector("strong");
  const closeViewer = () => {
    viewer.classList.remove("open");
    viewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("viewer-open");
  };

  elementCards.forEach((card) => card.addEventListener("click", (event) => {
    event.preventDefault();
    viewerImage.src = card.getAttribute("href");
    viewerImage.alt = `${card.querySelector("h3")?.textContent || "Elementos hero"} character profile`;
    viewerName.textContent = card.querySelector("h3")?.textContent || "Hero profile";
    viewer.classList.add("open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.classList.add("viewer-open");
    viewer.querySelector("button").focus();
  }));

  viewer.querySelector("button").addEventListener("click", closeViewer);
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer || event.target.classList.contains("hero-viewer-stage")) closeViewer();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && viewer.classList.contains("open")) closeViewer();
  });
}

const sabaricHeroLabels = document.querySelectorAll(".sabaric-hero-label");
if (sabaricHeroLabels.length) {
  const viewer = document.createElement("div");
  viewer.className = "kingdom-hero-viewer sabaric-hero-viewer";
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-modal", "true");
  viewer.setAttribute("aria-hidden", "true");
  viewer.innerHTML = `
    <div class="kingdom-hero-viewer-shell">
      <button class="kingdom-hero-close" type="button" aria-label="Close hero image">x</button>
      <h3></h3>
      <p class="kingdom-hero-viewer-team"></p>
      <div class="sabaric-viewer-stage">
        <button class="sabaric-viewer-nav sabaric-viewer-prev" type="button" aria-label="Previous suit image">PREV</button>
        <img alt="">
        <button class="sabaric-viewer-nav sabaric-viewer-next" type="button" aria-label="Next suit image">NEXT</button>
      </div>
      <p class="sabaric-viewer-count"></p>
    </div>`;
  document.body.appendChild(viewer);
  let activeImages = [];
  let activeName = "";
  let activeIndex = 0;
  const image = viewer.querySelector("img");
  const count = viewer.querySelector(".sabaric-viewer-count");
  const prev = viewer.querySelector(".sabaric-viewer-prev");
  const next = viewer.querySelector(".sabaric-viewer-next");
  const renderSuit = () => {
    if (!activeImages.length) return;
    image.src = activeImages[activeIndex];
    image.alt = `${activeName} Sabaric Team suit ${activeIndex + 1}`;
    count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(activeImages.length).padStart(2, "0")}`;
    prev.hidden = activeImages.length < 2;
    next.hidden = activeImages.length < 2;
  };
  const closeViewer = () => {
    viewer.classList.remove("open");
    viewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("viewer-open");
  };
  sabaricHeroLabels.forEach((button) => {
    button.addEventListener("click", () => {
      activeName = button.dataset.heroName;
      activeImages = (button.dataset.heroImages || button.dataset.heroSrc || "").split("|").filter(Boolean);
      activeIndex = 0;
      viewer.querySelector("h3").textContent = activeName;
      viewer.querySelector(".kingdom-hero-viewer-team").textContent = button.dataset.heroRank;
      renderSuit();
      viewer.classList.add("open");
      viewer.setAttribute("aria-hidden", "false");
      document.body.classList.add("viewer-open");
      viewer.querySelector(".kingdom-hero-close").focus();
    });
  });
  prev.addEventListener("click", () => {
    activeIndex = (activeIndex - 1 + activeImages.length) % activeImages.length;
    renderSuit();
  });
  next.addEventListener("click", () => {
    activeIndex = (activeIndex + 1) % activeImages.length;
    renderSuit();
  });
  viewer.querySelector(".kingdom-hero-close").addEventListener("click", closeViewer);
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) closeViewer();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && viewer.classList.contains("open")) closeViewer();
  });
}
const aniProfiles = {
  ic: {
    team: "ANI POW - Command Core",
    title: "The First Signal",
    accent: "#73bbff",
    images: ["IC/ChatGPT Image Jul 11, 2026, 07_32_35 PM (1).png", "IC/ChatGPT Image May 22, 2026, 06_40_36 PM.png", "IC/ChatGPT Image May 23, 2026, 04_23_01 PM.png"],
    about: "IC is one of the key ANI POW warriors, built around control, focus, and battlefield awareness. IC keeps the team aligned when the fight becomes chaotic.",
    details: ["Role: Tactical core", "Team: ANI POW", "Style: Focused, alert, controlled", "Power: Command presence and combat instinct"]
  },
  lissa: {
    team: "ANI POW - Grace and Spirit Warrior",
    title: "The Phantom Blossom",
    accent: "#b85cff",
    images: ["LISSA/ChatGPT Image Jul 11, 2026, 07_32_44 PM.png", "LISSA/ChatGPT Image May 22, 2026, 07_16_51 PM.png", "LISSA/ChatGPT Image May 23, 2026, 04_21_08 PM.png"],
    about: "LISSA is a graceful spirit warrior of ANI POW. She moves with silent speed, fights with a katana, and uses butterfly-like energy to confuse enemies before striking with precision.",
    details: ["Role: Grace and Spirit Warrior", "Weapon: Katana", "Style: Fast, elegant, unpredictable", "Power: Spirit wings, light dash, radiant slash"]
  },
  boss: {
    team: "ANI POW - Elite Archer Unit",
    title: "The Divine Archer",
    accent: "#f6c84c",
    images: ["BOSS/ChatGPT Image Jul 11, 2026, 07_32_41 PM.png", "BOSS/ChatGPT Image May 22, 2026, 07_16_56 PM.png", "BOSS/ChatGPT Image May 23, 2026, 04_31_47 PM.png"],
    about: "BOSS is ANI POW's legendary long-range fighter. Calm, tactical, and precise, he creates energy arrows and controls the battlefield before enemies can reach him.",
    details: ["Role: Long-range overwhelmer", "Weapon: Ancient divine bow", "Style: Calm, precise, tactical", "Power: Divine precision, energy arrows, hawk vision"]
  },
  swar: {
    team: "ANI POW - Strike Warrior",
    title: "The Relentless Blade",
    accent: "#6de0ff",
    images: ["SWAR/ChatGPT Image Jul 11, 2026, 07_32_37 PM.png", "SWAR/ChatGPT Image Jul 11, 2026, 07_32_38 PM.png", "SWAR/ChatGPT Image May 22, 2026, 07_16_53 PM.png", "SWAR/ChatGPT Image May 23, 2026, 04_28_59 PM.png"],
    about: "SWAR is a direct ANI POW fighter who brings pressure, speed, and sharp combat timing. He is made for close battles where hesitation loses the fight.",
    details: ["Role: Strike warrior", "Team: ANI POW", "Style: Fast, aggressive, loyal", "Power: Combat speed and battle pressure"]
  },
  brave: {
    team: "ANI POW - Close-range Destroyer",
    title: "The Unbreakable Titan",
    accent: "#ff8f3d",
    images: ["BRAVE/ChatGPT Image Jul 11, 2026, 07_32_43 PM.png", "BRAVE/ChatGPT Image May 22, 2026, 07_16_58 PM.png", "BRAVE/ChatGPT Image May 23, 2026, 04_20_52 PM.png"],
    about: "BRAVE is the strongest close-range warrior in ANI POW. His fists are his weapons, his body is his shield, and he wins through endurance, raw strength, and fearless pressure.",
    details: ["Role: Close-range destroyer", "Weapon: His fists", "Style: Powerful, direct, relentless", "Power: Titan strength, iron grip, battle endurance"]
  },
  "legon-star": {
    name: "GALAXY LEGON STAR",
    team: "ANI POW - Star Warrior",
    title: "The Galaxy Bond",
    accent: "#a889ff",
    images: ["LEGON STAR/ChatGPT Image Jul 11, 2026, 07_32_33 PM.png", "LEGON STAR/ChatGPT Image Jul 7, 2026, 09_49_17 PM.png"],
    about: "GALAXY LEGON STAR carries the cosmic side of ANI POW. His presence connects discipline, loyalty, and star-born energy into one powerful fighting identity.",
    details: ["Role: Star warrior", "Team: ANI POW", "Style: Calm, cosmic, precise", "Power: Galaxy energy and spiritual focus"]
  },
  leap: {
    team: "ANI POW - Motion Specialist",
    title: "The Sky Step",
    accent: "#74ffbd",
    images: ["LEAP/ChatGPT Image Jul 11, 2026, 07_32_32 PM.png", "LEAP/ChatGPT Image Jul 7, 2026, 09_49_14 PM.png"],
    about: "LEAP is built for movement, sudden attacks, and fast repositioning. He turns distance into advantage and keeps enemies reacting instead of planning.",
    details: ["Role: Motion specialist", "Team: ANI POW", "Style: Fast, evasive, sharp", "Power: Leaping speed and aerial control"]
  }
};

const aniProfileLinks = [...document.querySelectorAll("#ic, #lissa, #boss, #swar, #brave, #legon-star, #leap, #ani-ic, #ani-lissa, #ani-boss, #ani-swar, #ani-brave, #ani-legon-star, #ani-leap")];
if (aniProfileLinks.length) {
  const viewer = document.createElement("div");
  viewer.className = "ani-profile-viewer";
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-modal", "true");
  viewer.setAttribute("aria-hidden", "true");
  viewer.innerHTML = `
    <div class="ani-profile-shell">
      <button class="ani-profile-close" type="button" aria-label="Close ANI POW profile">x</button>
      <section class="ani-profile-copy">
        <span></span>
        <h2></h2>
        <h3></h3>
        <p></p>
        <ul></ul>
      </section>
      <section class="ani-profile-gallery" aria-label="Hero image gallery">
        <button class="ani-profile-nav ani-profile-prev" type="button" aria-label="Previous hero image">PREV</button>
        <figure class="ani-profile-shot">
          <img alt="">
          <figcaption></figcaption>
        </figure>
        <button class="ani-profile-nav ani-profile-next" type="button" aria-label="Next hero image">NEXT</button>
      </section>
    </div>`;
  document.body.appendChild(viewer);
  const fullViewer = document.createElement("div");
  fullViewer.className = "ani-full-image";
  fullViewer.setAttribute("role", "dialog");
  fullViewer.setAttribute("aria-modal", "true");
  fullViewer.setAttribute("aria-hidden", "true");
  fullViewer.innerHTML = `<button type="button" aria-label="Close full image">x</button><img alt="">`;
  document.body.appendChild(fullViewer);
  let activeProfile = null;
  let activeName = "";
  let activeIndex = 0;

  const closeViewer = () => {
    viewer.classList.remove("open");
    viewer.setAttribute("aria-hidden", "true");
    fullViewer.classList.remove("open");
    fullViewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("viewer-open");
  };
  const closeFullViewer = () => {
    fullViewer.classList.remove("open");
    fullViewer.setAttribute("aria-hidden", "true");
  };
  const renderAniImage = () => {
    if (!activeProfile) return;
    const image = viewer.querySelector(".ani-profile-shot img");
    const shot = viewer.querySelector(".ani-profile-shot");
    const caption = viewer.querySelector(".ani-profile-shot figcaption");
    const src = activeProfile.images[activeIndex];
    shot.classList.remove("is-missing");
    image.style.display = "";
    image.src = src;
    image.alt = `${activeName} ANI POW image ${activeIndex + 1}`;
    caption.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(activeProfile.images.length).padStart(2, "0")}`;
  };

  aniProfileLinks.forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    const profileKey = link.id.replace(/^ani-/, "");
    const profile = aniProfiles[profileKey];
    if (!profile) return;

    activeProfile = profile;
    activeName = profile.name || profileKey.toUpperCase();
    activeIndex = 0;
    viewer.style.setProperty("--ani-profile-accent", profile.accent);
    viewer.querySelector(".ani-profile-copy span").textContent = profile.team;
    viewer.querySelector(".ani-profile-copy h2").textContent = activeName;
    viewer.querySelector(".ani-profile-copy h3").textContent = profile.title;
    viewer.querySelector(".ani-profile-copy p").textContent = profile.about;
    viewer.querySelector(".ani-profile-copy ul").innerHTML = profile.details.map((item) => `<li>${item}</li>`).join("");
    renderAniImage();

    viewer.classList.add("open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.classList.add("viewer-open");
    viewer.querySelector(".ani-profile-close").focus();
  }));

  viewer.querySelector(".ani-profile-prev").addEventListener("click", () => {
    if (!activeProfile) return;
    activeIndex = (activeIndex - 1 + activeProfile.images.length) % activeProfile.images.length;
    renderAniImage();
  });
  viewer.querySelector(".ani-profile-next").addEventListener("click", () => {
    if (!activeProfile) return;
    activeIndex = (activeIndex + 1) % activeProfile.images.length;
    renderAniImage();
  });
  viewer.querySelector(".ani-profile-shot img").addEventListener("click", () => {
    if (!activeProfile) return;
    const image = fullViewer.querySelector("img");
    image.src = activeProfile.images[activeIndex];
    image.alt = `${activeName} ANI POW full image ${activeIndex + 1}`;
    fullViewer.classList.add("open");
    fullViewer.setAttribute("aria-hidden", "false");
  });
  viewer.querySelector(".ani-profile-shot img").addEventListener("error", () => {
    const shot = viewer.querySelector(".ani-profile-shot");
    shot.classList.add("is-missing");
    shot.append("Image file not found");
  });
  viewer.querySelector(".ani-profile-close").addEventListener("click", closeViewer);
  fullViewer.querySelector("button").addEventListener("click", closeFullViewer);
  fullViewer.addEventListener("click", (event) => {
    if (event.target === fullViewer) closeFullViewer();
  });
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) closeViewer();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && fullViewer.classList.contains("open")) closeFullViewer();
    else if (event.key === "Escape" && viewer.classList.contains("open")) closeViewer();
    else if (event.key === "ArrowLeft" && viewer.classList.contains("open") && activeProfile) {
      activeIndex = (activeIndex - 1 + activeProfile.images.length) % activeProfile.images.length;
      renderAniImage();
    } else if (event.key === "ArrowRight" && viewer.classList.contains("open") && activeProfile) {
      activeIndex = (activeIndex + 1) % activeProfile.images.length;
      renderAniImage();
    }
  });
}

document.querySelectorAll(".boss-preview img").forEach((image) => {
  image.addEventListener("error", () => {
    const figure = image.closest("figure");
    figure.classList.add("is-missing");
    figure.textContent = image.getAttribute("src");
  }, { once: true });
});

document.querySelectorAll("#elementosHeroes .mini-hero-grid a[href*='#']").forEach((link) => {
  const heroKey = link.getAttribute("href").split("#")[1];
  if (heroKey) link.href = `hero.html?hero=${encodeURIComponent(heroKey)}`;
  link.querySelector("img")?.remove();
});

// Populate the internal suit page from a safe, fixed Elementos hero archive.
const heroProfile = document.getElementById("heroProfile");
if (heroProfile) {
  const heroes = {
    pyron:["PYRON","The Flame Inferno","Fire","01-pyron.png"], neris:["NERIS","The Aqua Grace","Water","02-neris.png"],
    vayro:["VAYRO","The Smoke Phantom","Smoke","03-vayro.png"], sylva:["SYLVA","The Nature Blossom","Nature","04-sylva.png"],
    gravon:["GRAVON","The Stone Bastion","Earth","05-gravon.png"], cyrra:["CYRRA","The Hurricane Queen","Hurricane","06-cyrra.png"],
    marco:["MARCO","The Magnetic Vanguard","Magnetism","07-marco.png","Team Leader"], sonyx:["SONYX","The Sonic Phantom","Sonic","08-sonyx.png"],
    fera:["FERA","The Metal Empress","Metal","09-fera.png"], voltra:["VOLTRA","The Lightning Empress","Lightning","10-voltra.png"],
    polarx:["POLARX","The Ice Sovereign","Ice","11-polarx.png"], zyro:["ZYRO","The Speedster","Speed","12-zyro.png"],
    dunar:["DUNAR","The Sand Whipper","Sand","13-dunar.png"]
  };
  const key = new URLSearchParams(location.search).get("hero") || "marco";
  const hero = heroes[key] || heroes.marco;
  document.getElementById("profileName").textContent = hero[0];
  document.getElementById("profileTitle").textContent = hero[1];
  document.getElementById("profileElement").textContent = hero[2];
  document.getElementById("profileStatus").textContent = hero[4] || "Active Hero";
  const image = document.getElementById("profileImage");
  image.src = `assets/elementos/${hero[3]}`;
  image.alt = `${hero[0]} official suit and character design`;
  document.title = `${hero[0]} Suit | SAK Universe`;
}

const kingdomArchive = document.getElementById("kingdomArchive");
const kingdomPage = document.getElementById("kingdomPage");
const kingdomHeroesArchive = document.getElementById("kingdomHeroesArchive");
if (kingdomArchive || kingdomPage || kingdomHeroesArchive) {
  const base = "Kingdom archive";
  const kingdomData = [
    { name:"MAS RAK", displayName:"Mas Rak", teamName:"Mas Rak Guardians", images:["ChatGPT Image May 29, 2026, 05_12_45 PM.png","ChatGPT Image May 31, 2026, 04_04_58 PM.png"], folders:[{ name:"HERO'S OF MASRAK", images:["ChatGPT Image May 31, 2026, 05_03_31 PM.png","ChatGPT Image May 31, 2026, 05_03_34 PM.png","ChatGPT Image May 31, 2026, 05_03_35 PM.png","ChatGPT Image May 31, 2026, 05_03_38 PM.png","ChatGPT Image May 31, 2026, 05_03_40 PM.png","ChatGPT Image May 31, 2026, 05_03_56 PM.png","ChatGPT Image May 31, 2026, 05_04_00 PM.png","ChatGPT Image May 31, 2026, 05_04_02 PM.png","ChatGPT Image May 31, 2026, 05_04_11 PM.png","ChatGPT Image May 31, 2026, 05_10_09 PM.png"] }] },
    { name:"BANIZAR", displayName:"Banizar", teamName:"The Radiant Sentinels of Banizar", images:["ChatGPT Image Jul 11, 2026, 03_29_15 PM.png","ChatGPT Image May 30, 2026, 12_26_54 PM.png"], folders:[{ name:"HERO's", images:["ChatGPT Image Jul 11, 2026, 03_28_38 PM.png","ChatGPT Image Jul 11, 2026, 03_28_42 PM.png","ChatGPT Image Jul 11, 2026, 03_28_45 PM.png","ChatGPT Image Jul 11, 2026, 03_28_47 PM.png"] }] },
    { name:"LUNARA", displayName:"Lunara", teamName:"The Lunara Guardians", images:["ChatGPT Image Jul 11, 2026, 04_05_36 PM.png","ChatGPT Image May 29, 2026, 05_34_12 PM.png"], folders:[{ name:"HEROS", images:["ChatGPT Image Jul 11, 2026, 04_06_26 PM.png","ChatGPT Image Jul 11, 2026, 04_06_28 PM.png","ChatGPT Image Jul 11, 2026, 04_06_30 PM.png","ChatGPT Image Jul 11, 2026, 04_06_31 PM.png","ChatGPT Image Jul 11, 2026, 04_06_34 PM.png"] }] },
    { name:"VELRON", displayName:"Velron", teamName:"The Crimson Vanguard of Velron", images:["ChatGPT Image Jul 11, 2026, 04_44_02 PM.png","ChatGPT Image May 29, 2026, 05_34_10 PM.png"], folders:[{ name:"HEROS", images:["ChatGPT Image Jul 11, 2026, 04_34_53 PM.png","ChatGPT Image Jul 11, 2026, 04_34_55 PM.png","ChatGPT Image Jul 11, 2026, 04_35_02 PM.png","ChatGPT Image Jul 11, 2026, 04_35_04 PM.png","ChatGPT Image Jul 11, 2026, 04_35_07 PM.png"] }] },
    { name:"RAVARON", displayName:"Ravaron", teamName:"The Crimson Dominion", images:["ChatGPT Image Jul 11, 2026, 03_25_23 PM.png","ChatGPT Image May 29, 2026, 05_34_14 PM.png"], folders:[{ name:"HERO's", images:["ChatGPT Image Jul 11, 2026, 03_25_12 PM.png","ChatGPT Image Jul 11, 2026, 03_25_14 PM.png","ChatGPT Image Jul 11, 2026, 03_25_16 PM.png","ChatGPT Image Jul 11, 2026, 03_25_19 PM.png","ChatGPT Image Jul 11, 2026, 03_25_20 PM.png"] }] },
    { name:"TAROKA", displayName:"Taroka", teamName:"The Verdant Vanguard", images:["ChatGPT Image Jul 11, 2026, 04_13_17 PM.png","ChatGPT Image May 29, 2026, 05_36_36 PM.png"], folders:[{ name:"HEROS", images:["ChatGPT Image Jul 11, 2026, 04_10_21 PM.png","ChatGPT Image Jul 11, 2026, 04_10_24 PM.png","ChatGPT Image Jul 11, 2026, 04_10_26 PM.png","ChatGPT Image Jul 11, 2026, 04_10_29 PM.png","ChatGPT Image Jul 11, 2026, 04_10_31 PM.png","ChatGPT Image Jul 11, 2026, 04_10_34 PM.png","ChatGPT Image Jul 11, 2026, 04_10_37 PM.png"] }] },
    { key:"SATARON", name:"SAT OCT", displayName:"Sataron", teamName:"Sataron Royal Guardians", images:["ChatGPT Image May 29, 2026, 05_22_00 PM.png","ChatGPT Image May 29, 2026, 05_22_10 PM.png","ChatGPT Image May 31, 2026, 04_04_56 PM.png"], folders:[{ name:"HERO'F OF SATOCT", images:["ChatGPT Image May 31, 2026, 05_10_57 PM.png","ChatGPT Image May 31, 2026, 05_11_09 PM.png","ChatGPT Image May 31, 2026, 05_11_13 PM.png","ChatGPT Image May 31, 2026, 05_11_23 PM.png","ChatGPT Image May 31, 2026, 05_11_35 PM.png"] }] },
    { key:"OCTARIS", name:"SAT OCT", displayName:"Octaris", teamName:"Octaris Royal Guardians", images:["ChatGPT Image May 29, 2026, 05_22_00 PM.png","ChatGPT Image May 29, 2026, 05_22_10 PM.png","ChatGPT Image May 31, 2026, 04_04_56 PM.png"], folders:[{ name:"HERO'F OF SATOCT", images:["ChatGPT Image May 31, 2026, 05_10_57 PM.png","ChatGPT Image May 31, 2026, 05_11_09 PM.png","ChatGPT Image May 31, 2026, 05_11_13 PM.png","ChatGPT Image May 31, 2026, 05_11_23 PM.png","ChatGPT Image May 31, 2026, 05_11_35 PM.png"] }] },
    { name:"ZYTORA", displayName:"Zytora", teamName:"The Zytora Legion", images:["ChatGPT Image May 29, 2026, 05_12_48 PM.png","ChatGPT Image May 31, 2026, 04_05_00 PM.png"], folders:[{ name:"The Zytora Legion", images:["ChatGPT Image May 31, 2026, 05_21_51 PM.png","ChatGPT Image May 31, 2026, 05_23_26 PM.png","ChatGPT Image May 31, 2026, 05_27_01 PM.png","ChatGPT Image May 31, 2026, 05_27_33 PM.png","ChatGPT Image May 31, 2026, 05_28_32 PM.png","ChatGPT Image May 31, 2026, 05_30_34 PM.png","ChatGPT Image May 31, 2026, 05_32_21 PM.png","ChatGPT Image May 31, 2026, 05_44_47 PM.png","ChatGPT Image May 31, 2026, 05_44_52 PM.png"] }] }
  ];
  const asset = (...parts) => encodeURI(parts.join("/")).replace(/'/g, "%27");
  const imageLabel = (src, alt, label) => `
    <figure class="kingdom-image-label" data-full-src="${src}" data-full-title="${label}">
      <img loading="lazy" src="${src}" alt="${alt}">
      <figcaption>${label}</figcaption>
    </figure>`;
  const heroNameLabel = (kingdom, team, file, imageIndex) => {
    const heroName = kingdomHeroNames[kingdomSlug(kingdom)]?.[imageIndex] || `${kingdomTitle(kingdom)} Hero ${String(imageIndex + 1).padStart(2, "0")}`;
    return `
      <button class="kingdom-hero-name" type="button" data-hero-src="${asset(base, kingdom.name, team.name, file)}" data-hero-name="${heroName}">
        <span>${String(imageIndex + 1).padStart(2, "0")}</span>
        <strong>${heroName}</strong>
      </button>`;
  };
  const kingdomTitle = (kingdom) => kingdom.displayName || kingdom.name;
  const teamTitle = (kingdom) => kingdom.teamName || kingdom.folders[0]?.name || `${kingdomTitle(kingdom)} HERO TEAM`;
  const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const kingdomSlug = (kingdom) => slug(kingdom.key || kingdom.name);
  const kingdomHeroNames = {
    "mas-rak": ["RAKASO MARKO MASS", "VALKAR", "CAELRON", "WARTHOR", "KAEVOR", "ROSKAR", "LYGARA", "FOXARA", "GLARION", "MASTER MASK"],
    banizar: ["VALIZAR", "AURELION", "SERAPHYNE", "LEONIS"],
    lunara: ["NOCTHARIS", "SELENEA", "UMBRION", "NYTHERA", "ASTERION"],
    velron: ["KAELDRAK", "DRAVENOR", "VAELYRA", "RAVESSIA", "THORGAR"],
    ravaron: ["KING RAVAKOR", "KAELDRAK", "VARKAEL", "NYXARA", "VAELITH"],
    taroka: ["KING AURELION", "LYSERA", "ERYNDOR", "KAELOR", "THALION", "SYLVARA", "VAELORA"],
    sataron: ["SATARIN", "ARISA", "TAGRIX", "OCTAN", "OCTALAN"],
    octaris: ["SATARIN", "ARISA", "TAGRIX", "OCTAN", "OCTALAN"],
    zytora: ["ZALAX", "THORAN", "AURELIA", "VEXARA", "SYLARA", "KAELYN", "DRAKOR", "LEBYOTE", "REVOX"]
  };
  if (kingdomArchive) {
    const kingdomLabels = kingdomData.map((kingdom, index) => `
      <article class="kingdom-name-label">
        <a class="kingdom-primary-link" href="kingdom.html?kingdom=${kingdomSlug(kingdom)}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${kingdomTitle(kingdom)}</strong>
        </a>
        <a class="kingdom-team-sublabel" href="kingdom.html?kingdom=${kingdomSlug(kingdom)}&team=open#kingdomTeam">
          <span>Superhero team</span>
          <strong>${teamTitle(kingdom)}</strong>
        </a>
      </article>`).join("");
    kingdomArchive.innerHTML = `<div class="kingdom-name-grid">${kingdomLabels}</div>`;
  }

  if (kingdomHeroesArchive) {
    kingdomHeroesArchive.innerHTML = kingdomData.map((kingdom, index) => {
      const team = kingdom.folders[0] || { name: `${kingdom.name} HERO TEAM`, images: [] };
      const teamLink = `kingdom.html?kingdom=${kingdomSlug(kingdom)}&team=open#kingdomTeam`;
      const heroes = team.images.map((file, imageIndex) => {
        const heroName = kingdomHeroNames[kingdomSlug(kingdom)]?.[imageIndex] || `${kingdomTitle(kingdom)} Hero ${String(imageIndex + 1).padStart(2, "0")}`;
        return `
          <button class="kingdom-hero-mini" type="button" data-hero-src="${asset(base, kingdom.name, team.name, file)}" data-hero-name="${heroName}" data-hero-team="${teamTitle(kingdom)}">
            <b>${heroName}</b>
            <span>${teamTitle(kingdom)}</span>
          </button>`;
      }).join("");
      return `
        <article class="kingdom-hero-team-card">
          <div class="kingdom-hero-team-head">
            <span>${String(index + 1).padStart(2, "0")} - ${kingdomTitle(kingdom)}</span>
            <h3>${teamTitle(kingdom)}</h3>
            <a href="${teamLink}">Open team</a>
          </div>
          <div class="kingdom-hero-mini-grid">${heroes}</div>
        </article>`;
    }).join("");
    const heroViewer = document.createElement("div");
    heroViewer.className = "kingdom-hero-viewer";
    heroViewer.setAttribute("role", "dialog");
    heroViewer.setAttribute("aria-modal", "true");
    heroViewer.setAttribute("aria-hidden", "true");
    heroViewer.innerHTML = `
      <div class="kingdom-hero-viewer-shell">
        <button class="kingdom-hero-close" type="button" aria-label="Close hero image">x</button>
        <h3></h3>
        <p class="kingdom-hero-viewer-team"></p>
        <img alt="">
      </div>`;
    document.body.appendChild(heroViewer);
    const closeHeroViewer = () => {
      heroViewer.classList.remove("open");
      heroViewer.setAttribute("aria-hidden", "true");
      document.body.classList.remove("viewer-open");
    };
    kingdomHeroesArchive.querySelectorAll(".kingdom-hero-mini").forEach((button) => {
      button.addEventListener("click", () => {
        const image = heroViewer.querySelector("img");
        const heroName = button.dataset.heroName;
        heroViewer.querySelector("h3").textContent = heroName;
        heroViewer.querySelector(".kingdom-hero-viewer-team").textContent = button.dataset.heroTeam;
        image.src = button.dataset.heroSrc;
        image.alt = `${heroName} superhero image`;
        heroViewer.classList.add("open");
        heroViewer.setAttribute("aria-hidden", "false");
        document.body.classList.add("viewer-open");
        heroViewer.querySelector(".kingdom-hero-close").focus();
      });
    });
    heroViewer.querySelector(".kingdom-hero-close").addEventListener("click", closeHeroViewer);
    heroViewer.addEventListener("click", (event) => {
      if (event.target === heroViewer) closeHeroViewer();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && heroViewer.classList.contains("open")) closeHeroViewer();
    });
  }
  if (kingdomPage) {
    const pageParams = new URLSearchParams(location.search);
    const requested = pageParams.get("kingdom");
    const index = Math.max(0, kingdomData.findIndex((kingdom) => kingdomSlug(kingdom) === requested));
    const kingdom = kingdomData[index];
    const team = kingdom.folders[0] || { name: `${kingdom.name} HERO TEAM`, images: [] };
    kingdomPage.innerHTML = `
      <a class="back-home" href="kingdoms.html">All kingdoms</a>
      <article class="kingdom-open-card">
        <div class="kingdom-open-head">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div><h3>${kingdomTitle(kingdom)}</h3><p>${String(kingdom.images.length).padStart(2, "0")} kingdom images</p></div>
        </div>
        <div class="kingdom-main-images">
          ${kingdom.images.map((file, imageIndex) =>
            imageLabel(asset(base, kingdom.name, file), `${kingdom.name} kingdom image ${imageIndex + 1}`, `Kingdom ${String(imageIndex + 1).padStart(2, "0")}`)
          ).join("")}
        </div>
        <button class="kingdom-team-label" id="kingdomTeam" type="button" aria-expanded="false">
          <span>Superhero team</span>
          <strong>${teamTitle(kingdom)}</strong>
        </button>
        <div class="kingdom-folder-grid kingdom-heroes-grid" hidden>
          ${team.images.map((file, imageIndex) =>
            heroNameLabel(kingdom, team, file, imageIndex)
          ).join("")}
        </div>
      </article>
      <a class="back-home kingdom-bottom-back" href="kingdoms.html">Back to kingdom labels</a>`;
    document.title = `${kingdomTitle(kingdom)} Kingdom | SAK Universe`;
    const teamLabel = kingdomPage.querySelector(".kingdom-team-label");
    const heroesGrid = kingdomPage.querySelector(".kingdom-heroes-grid");
    const heroViewer = document.createElement("div");
    heroViewer.className = "kingdom-hero-viewer";
    heroViewer.setAttribute("role", "dialog");
    heroViewer.setAttribute("aria-modal", "true");
    heroViewer.setAttribute("aria-hidden", "true");
    heroViewer.innerHTML = `
      <div class="kingdom-hero-viewer-shell">
        <button class="kingdom-hero-close" type="button" aria-label="Close hero image">x</button>
        <h3></h3>
        <img alt="">
      </div>`;
    document.body.appendChild(heroViewer);
    const closeHeroViewer = () => {
      heroViewer.classList.remove("open");
      heroViewer.setAttribute("aria-hidden", "true");
      document.body.classList.remove("viewer-open");
    };
    const openFullImage = (src, title, alt) => {
      const image = heroViewer.querySelector("img");
      heroViewer.querySelector("h3").textContent = title;
      image.src = src;
      image.alt = alt;
      heroViewer.classList.add("open");
      heroViewer.setAttribute("aria-hidden", "false");
      document.body.classList.add("viewer-open");
      heroViewer.querySelector(".kingdom-hero-close").focus();
    };
    const showHeroes = () => {
      heroesGrid.hidden = false;
      teamLabel.setAttribute("aria-expanded", "true");
    };
    kingdomPage.querySelectorAll(".kingdom-image-label").forEach((label) => {
      label.setAttribute("tabindex", "0");
      label.setAttribute("role", "button");
      label.setAttribute("aria-label", `Open ${label.dataset.fullTitle} full image`);
      const openLabel = () => openFullImage(
        label.dataset.fullSrc,
        label.dataset.fullTitle,
        label.querySelector("img")?.alt || label.dataset.fullTitle
      );
      label.addEventListener("click", openLabel);
      label.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLabel();
        }
      });
    });
    heroesGrid.querySelectorAll(".kingdom-hero-name").forEach((button) => {
      button.addEventListener("click", () => {
        const heroName = button.dataset.heroName;
        openFullImage(button.dataset.heroSrc, heroName, `${heroName} superhero image`);
      });
    });
    heroViewer.querySelector(".kingdom-hero-close").addEventListener("click", closeHeroViewer);
    heroViewer.addEventListener("click", (event) => {
      if (event.target === heroViewer) closeHeroViewer();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && heroViewer.classList.contains("open")) closeHeroViewer();
    });
    teamLabel.addEventListener("click", () => {
      const opened = heroesGrid.toggleAttribute("hidden");
      teamLabel.setAttribute("aria-expanded", String(!opened));
      if (!opened) heroesGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    if (pageParams.get("team") === "open") {
      showHeroes();
      window.setTimeout(() => teamLabel.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
  }
}

const mapStage = document.getElementById("mapStage");
if (mapStage) {
  const mapImage = mapStage.querySelector("img");
  let mapScale = 1.04;
  let mapX = 0;
  let mapY = 0;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  const renderMap = () => { mapImage.style.transform = `translate(${mapX}px, ${mapY}px) scale(${mapScale})`; };
  const resetMap = () => { mapScale = 1.04; mapX = 0; mapY = 0; renderMap(); };
  const controls = document.createElement("div");
  controls.className = "map-controls";
  controls.innerHTML = '<button type="button" data-map-action="zoom-in" aria-label="Zoom in">+</button><button type="button" data-map-action="zoom-out" aria-label="Zoom out">−</button><button type="button" data-map-action="reset" aria-label="Reset map">⌂</button>';
  mapStage.append(controls);
  const compass = document.createElement("div");
  compass.className = "map-compass";
  compass.setAttribute("aria-hidden", "true");
  compass.innerHTML = "<span>N</span><b>◆</b>";
  mapStage.append(compass);
  controls.addEventListener("click", (event) => {
    const action = event.target.closest("button")?.dataset.mapAction;
    if (action === "zoom-in") mapScale = Math.min(2.6, mapScale + .18);
    if (action === "zoom-out") mapScale = Math.max(1.04, mapScale - .18);
    if (action === "reset") return resetMap();
    renderMap();
  });
  mapStage.addEventListener("wheel", (event) => {
    event.preventDefault();
    mapScale = Math.max(1.04, Math.min(2.6, mapScale + (event.deltaY < 0 ? .12 : -.12)));
    renderMap();
  }, { passive: false });
  mapStage.addEventListener("pointerdown", (event) => {
    dragging = true; startX = event.clientX - mapX; startY = event.clientY - mapY;
    mapStage.setPointerCapture(event.pointerId); mapStage.classList.add("is-dragging");
  });
  mapStage.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    mapX = event.clientX - startX; mapY = event.clientY - startY; renderMap();
  });
  const stopDragging = () => { dragging = false; mapStage.classList.remove("is-dragging"); };
  mapStage.addEventListener("pointerup", stopDragging);
  mapStage.addEventListener("pointercancel", stopDragging);
  renderMap();
}

const govTabs = [...document.querySelectorAll(".gov-tabs a")];
const govProfiles = [...document.querySelectorAll(".gov-profile")];
if (govTabs.length && govProfiles.length) {
  const hashGovTabs = govTabs.filter((tab) => tab.getAttribute("href")?.startsWith("#"));
  if (hashGovTabs.length) {
  const showGovernment = (id, scroll = true) => {
    const selected = govProfiles.find((profile) => profile.id === id) || govProfiles[0];
    govProfiles.forEach((profile) => {
      profile.hidden = profile !== selected;
    });
    govTabs.forEach((tab) => {
      const active = tab.getAttribute("href") === `#${selected.id}`;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-current", active ? "page" : "false");
    });
    if (location.hash !== `#${selected.id}`) history.replaceState(null, "", `#${selected.id}`);
    if (scroll) selected.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  hashGovTabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      showGovernment(tab.getAttribute("href").slice(1));
    });
  });

  showGovernment(location.hash.slice(1) || hashGovTabs[0]?.getAttribute("href").slice(1) || govProfiles[0].id, false);
  }
}

const circleProfiles = {
  kaizen: "assets/god/kaizen-profile.png",
  veyra: "assets/god/veyra-profile.png",
  zephor: "assets/god/zephor-profile.png",
  lysera: "assets/god/lysera-profile.png",
  draven: "assets/god/draven-profile.png",
  nyra: "assets/god/nyra-profile.png"
};
const circleProfileLinks = [...document.querySelectorAll("#kaizen, #veyra, #zephor, #lysera, #draven, #nyra, #circle-kaizen, #circle-veyra, #circle-zephor, #circle-lysera, #circle-draven, #circle-nyra")];
if (circleProfileLinks.length) {
  const viewer = document.createElement("div");
  viewer.className = "hero-viewer";
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-modal", "true");
  viewer.setAttribute("aria-hidden", "true");
  viewer.innerHTML = `<div class="hero-viewer-bar"><div><span>Circle Agents</span><strong></strong></div><button type="button" aria-label="Close hero profile">×</button></div><div class="hero-viewer-stage"><img alt=""></div>`;
  document.body.appendChild(viewer);
  const viewerImage = viewer.querySelector("img");
  const viewerName = viewer.querySelector("strong");
  const closeViewer = () => {
    viewer.classList.remove("open");
    viewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("viewer-open");
  };
  circleProfileLinks.forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    const name = link.id.replace("circle-", "");
    viewerImage.src = circleProfiles[name];
    viewerImage.alt = `${name} Circle Agent character profile`;
    viewerName.textContent = name.toUpperCase();
    viewer.classList.add("open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.classList.add("viewer-open");
    viewer.querySelector("button").focus();
  }));
  viewer.querySelector("button").addEventListener("click", closeViewer);
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer || event.target.classList.contains("hero-viewer-stage")) closeViewer();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && viewer.classList.contains("open")) closeViewer();
  });
}

// Shared premium interaction layer. It stays lightweight and automatically
// applies to new archive cards without changing page-specific behavior.
const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const progress = document.createElement("div");
progress.className = "sak-scroll-progress";
progress.setAttribute("aria-hidden", "true");
progress.innerHTML = "<span></span>";
document.body.append(progress);
const progressBar = progress.firstElementChild;
let progressFrame = 0;
const updateProgress = () => {
  progressFrame = 0;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
};
window.addEventListener("scroll", () => {
  if (!progressFrame) progressFrame = window.requestAnimationFrame(updateProgress);
}, { passive: true });
updateProgress();

const depthSelectors = [
  ".story-card", ".flames-label", ".gov-tabs a", ".gov-location-grid a",
  ".kingdom-name-label", ".kingdom-hero-name", ".sabaric-hero-label",
  ".hero-archive .mini-hero-grid a", ".comic-archive-grid a", ".lore-panel",
  ".contact-card", ".team-label", ".team-feature figure"
].join(",");
document.querySelectorAll(depthSelectors).forEach((card) => {
  card.classList.add("sak-depth-card");
  if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--pointer-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty("--pointer-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--pointer-x", "50%");
    card.style.setProperty("--pointer-y", "0%");
  });
});

document.querySelectorAll("img").forEach((image) => {
  if (!image.complete) image.classList.add("sak-image-loading");
  image.addEventListener("load", () => {
    image.classList.remove("sak-image-loading");
    image.classList.add("sak-image-ready");
  }, { once: true });
  image.addEventListener("error", () => image.classList.remove("sak-image-loading"), { once: true });
});
document.querySelectorAll(".brand").forEach((brand) => {
  brand.href = "https://two-quill-author-website.vercel.app/";
  brand.setAttribute("aria-label", "Back to Two Quill Stories");
});
