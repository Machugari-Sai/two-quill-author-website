const title = document.querySelector("#readerTitle");
const image = document.querySelector("#readerImage");
const status = document.querySelector("#readerStatus");
const previous = document.querySelector("#readerPrevious");
const next = document.querySelector("#readerNext");
const close = document.querySelector("#readerClose");
const requestedFolder = new URLSearchParams(window.location.search).get("folder");
let activeFolder;
let pageIndex = 0;
let pageTurning = false;
const stageFigure = document.querySelector(".flames-reader-stage figure");

function showPage() {
  const page = activeFolder.pages[pageIndex];
  const base = activeFolder.basePath ? `${activeFolder.basePath}/` : "";
  title.textContent = activeFolder.name;
  image.src = encodeURI(`${base}${activeFolder.name}/${page}`);
  image.alt = `${activeFolder.name} page ${pageIndex + 1}`;
  status.textContent = `Page ${pageIndex + 1} of ${activeFolder.pages.length}`;
  previous.disabled = pageIndex === 0;
  next.disabled = pageIndex === activeFolder.pages.length - 1;
}

async function loadReader() {
  const response = await fetch("/api/flames-of-war");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to load this comic.");
  activeFolder = data.folders.find((folder) => folder.name === requestedFolder);
  if (!activeFolder || !activeFolder.pages.length) throw new Error("This comic has no image pages yet.");
  showPage();
}

function turnPage(direction) {
  if (!activeFolder || pageTurning) return;
  const nextPage = pageIndex + direction;
  if (nextPage < 0 || nextPage >= activeFolder.pages.length) return;
  pageTurning = true;
  stageFigure.classList.add(direction > 0 ? "turning-next" : "turning-prev");
  window.setTimeout(() => { pageIndex = nextPage; showPage(); }, 360);
  window.setTimeout(() => { stageFigure.classList.remove("turning-next", "turning-prev"); pageTurning = false; }, 720);
}
previous.addEventListener("click", () => turnPage(-1));
next.addEventListener("click", () => turnPage(1));
close.addEventListener("click", () => { window.location.href = "flames-of-war.html"; });
loadReader().catch((error) => { title.textContent = "Comic unavailable"; status.textContent = error.message; });
