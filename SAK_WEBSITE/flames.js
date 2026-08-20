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
  const closeButton = reader.querySelector(".comic-reader-close");
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
  closeButton.addEventListener("click", close);
  reader.addEventListener("click", (event) => { if (event.target === reader) close(); });
  let touchStartX = null;
  const stage = reader.querySelector(".comic-reader-stage");
  stage.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? null;
  }, { passive: true });
  stage.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(distance) >= 45) {
      if (distance < 0 && page < folder.pages.length - 1) page += 1;
      if (distance > 0 && page > 0) page -= 1;
      render();
    }
  }, { passive: true });
  image.addEventListener("error", () => {
    image.removeAttribute("src");
    image.alt = "Comic page unavailable";
    reader.querySelector(".comic-page-missing").textContent = "This comic page could not be loaded.";
  });
  document.body.classList.add("viewer-open");
  render();
}

async function loadFlames() {
  try {
    const data = await window.SAKComicData.load();
    count.textContent = `${data.folders.length} labels`;
    grid.innerHTML = data.folders.map((folder, index) => {
      const folderPath = folder.basePath ? `${folder.basePath}/` : "";
      const cover = folder.pages[0] ? encodeURI(`${folderPath}${folder.name}/${folder.pages[0]}`) : "";
      return `<a class="flames-label" href="flames-reader.html?folder=${encodeURIComponent(folder.name)}">${cover ? `<img src="${cover}" alt="">` : ""}<span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(folder.name)}</strong><small>${folder.pages.length} comic pages · Open comic</small></a>`;
    }).join("");
    grid.querySelectorAll(".flames-label").forEach((label, index) => {
      label.addEventListener("click", (event) => {
        event.preventDefault();
        openFolder(data.folders[index]);
      });
    });
  } catch {
    count.textContent = "";
    grid.innerHTML = '<p class="flames-status flames-error">Comic data could not be loaded. Please try again.</p>';
  }
}

loadFlames();
