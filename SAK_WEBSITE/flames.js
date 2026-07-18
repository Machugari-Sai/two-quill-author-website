const grid = document.querySelector("#flamesGrid");
const count = document.querySelector("#flamesCount");
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));

function createReader() {
  const reader = document.createElement("div");
  reader.className = "comic-reader open";
  reader.setAttribute("role", "dialog");
  reader.setAttribute("aria-modal", "true");
  reader.innerHTML = `<div class="comic-reader-shell"><div class="comic-reader-bar"><div><span>Flames of War · Folder</span><strong></strong></div><button class="comic-reader-close" type="button" aria-label="Close comic">&times;</button></div><div class="comic-reader-stage"><figure class="comic-page-frame"><img alt=""><figcaption class="comic-page-missing"></figcaption></figure></div><div class="comic-reader-controls"><button class="comic-prev" type="button">Previous</button><span></span><button class="comic-next" type="button">Next</button></div></div>`;
  document.body.appendChild(reader);
  return reader;
}

function openFolder(folder) {
  const reader = createReader();
  const image = reader.querySelector("img");
  const title = reader.querySelector(".comic-reader-bar strong");
  const counter = reader.querySelector(".comic-reader-controls span");
  const previous = reader.querySelector(".comic-prev");
  const next = reader.querySelector(".comic-next");
  const close = () => { window.location.href = "flames-of-war.html"; };
  let page = 0;
  const render = () => {
    const file = folder.pages[page];
    title.textContent = `${folder.name} · Page ${String(page + 1).padStart(2, "0")}`;
    counter.textContent = `${page + 1} / ${folder.pages.length}`;
    image.alt = `${folder.name} page ${page + 1}`;
    const folderPath = folder.basePath ? `${folder.basePath}/` : "";
    image.src = encodeURI(`${folderPath}${folder.name}/${file}`);
    previous.disabled = page === 0;
    next.disabled = page === folder.pages.length - 1;
  };
  previous.addEventListener("click", () => { if (page > 0) { page -= 1; render(); } });
  next.addEventListener("click", () => { if (page < folder.pages.length - 1) { page += 1; render(); } });
  close.addEventListener("click", close);
  reader.addEventListener("click", (event) => { if (event.target === reader) close(); });
  document.body.classList.add("viewer-open");
  render();
}

async function loadFlames() {
  const response = await fetch("/api/flames-of-war");
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to load the Flames of War folders.");
  count.textContent = `${data.folders.length} labels`;
  grid.innerHTML = data.folders.map((folder, index) => {
    const folderPath = folder.basePath ? `${folder.basePath}/` : "";
    const cover = folder.pages[0] ? encodeURI(`${folderPath}${folder.name}/${folder.pages[0]}`) : "";
    return `<a class="flames-label" href="flames-reader.html?folder=${encodeURIComponent(folder.name)}">${cover ? `<img src="${cover}" alt="">` : ""}<span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(folder.name)}</strong><small>${folder.pages.length} comic pages · Open comic</small></a>`;
  }).join("");
}

loadFlames().catch((error) => { grid.innerHTML = `<p class="flames-status flames-error">${escapeHtml(error.message)}</p>`; });
