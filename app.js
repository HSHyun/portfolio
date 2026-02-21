const yearsEl = document.getElementById("years");

const mainHome = document.getElementById("main-home");
const mainProject = document.getElementById("main-project");
const ui = {
  kicker: document.getElementById("kicker"),
  title: document.getElementById("title"),
  desc: document.getElementById("desc"),
  hero: document.getElementById("hero"),
  chips: document.getElementById("chips"),
  body: document.getElementById("body"),
  links: document.getElementById("links"),
};

function groupByYear(items){
  const map = new Map();
  for(const it of items){
    if(!map.has(it.year)) map.set(it.year, []);
    map.get(it.year).push(it);
  }
  return [...map.entries()]
    .sort((a,b)=> b[0]-a[0])
    .map(([year, arr]) => [year, arr]);
}

function renderSidebar(items, selectedId){
  yearsEl.innerHTML = "";
  const grouped = groupByYear(items);

  grouped.forEach(([year, arr]) => {
    const block = document.createElement("div");
    block.className = "year-block collapsed";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "year-toggle";
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.innerHTML = `<span class="year-toggle-icon" aria-hidden="true">▶</span><span class="year-num">${year}</span>`;
    toggleBtn.addEventListener("click", () => {
      const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
      block.classList.toggle("collapsed", isExpanded);
      toggleBtn.setAttribute("aria-expanded", !isExpanded);
      const icon = toggleBtn.querySelector(".year-toggle-icon");
      if (icon) icon.textContent = isExpanded ? "▶" : "▼";
    });

    const ul = document.createElement("ul");
    ul.className = "list";

    arr.forEach(p => {
      const li = document.createElement("li");

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "item-btn";
      btn.setAttribute("data-id", p.id);
      btn.setAttribute("aria-selected", String(p.id === selectedId));

      btn.innerHTML = `
        <span class="marker" aria-hidden="true"></span>
        <span class="item-text">
          <p class="item-title">${escapeHtml(p.title)}</p>
          <p class="item-meta">${escapeHtml(p.meta || p.summary || "")}</p>
        </span>
      `;

      btn.addEventListener("click", () => selectProject(p.id, true));
      li.appendChild(btn);
      ul.appendChild(li);
    });

    block.appendChild(toggleBtn);
    block.appendChild(ul);
    yearsEl.appendChild(block);
  });
}

function renderMain(p){
  ui.kicker.textContent = `${p.year} · ${p.meta ?? ""}`.trim().replace(/\s·\s$/, "");
  ui.title.textContent = p.title;
  ui.desc.textContent = p.summary ?? "";

  ui.hero.innerHTML = "";
  if (p.image) {
    const img = document.createElement("img");
    img.alt = `${p.title} 대표 이미지`;
    img.src = p.image;
    ui.hero.appendChild(img);
  } else {
    ui.hero.textContent = "대표 이미지 자리 (선택사항)";
  }
  ui.chips.innerHTML = "";
  (p.tags || []).forEach(t => {
    const li = document.createElement("li");
    li.className = "chip";
    li.textContent = t;
    ui.chips.appendChild(li);
  });

  ui.body.textContent = p.body ?? "";
  ui.links.innerHTML = "";
  (p.links || []).forEach(l => {
    const a = document.createElement("a");
    a.className = "btn";
    a.href = l.url;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.textContent = l.label;
    ui.links.appendChild(a);
  });

  if ((p.links || []).length === 0) {
    ui.links.style.display = "none";
  } else {
    ui.links.style.display = "flex";
  }
}

function setSidebarSelection(selectedId){
  yearsEl.querySelectorAll(".item-btn").forEach(btn => {
    const id = btn.getAttribute("data-id");
    btn.setAttribute("aria-selected", String(id === selectedId));
  });
}

function showDefaultView(){
  mainHome.classList.remove("is-hidden");
  mainProject.classList.remove("is-visible");
  setSidebarSelection("");
  history.replaceState({}, "", "#projects");
}

function selectProject(id, pushState){
  const p = PROJECTS.find(x => x.id === id);
  if(!p) return;

  mainHome.classList.add("is-hidden");
  mainProject.classList.add("is-visible");
  renderMain(p);
  setSidebarSelection(id);

  if(pushState){
    history.pushState({ id }, "", `#${encodeURIComponent(id)}`);
  }
}

function currentFiltered(){
  return PROJECTS;
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

window.addEventListener("popstate", (e) => {
  const id = (e.state && e.state.id) ? e.state.id : (location.hash ? decodeURIComponent(location.hash.slice(1)) : "");
  const project = id ? PROJECTS.find(p => p.id === id) : null;
  if (project) {
    mainHome.classList.add("is-hidden");
    mainProject.classList.add("is-visible");
    renderMain(project);
    setSidebarSelection(id);
  } else {
    showDefaultView();
  }
});

function init() {
  const filtered = currentFiltered();
  const fromHash = location.hash ? decodeURIComponent(location.hash.slice(1)) : "";
  renderSidebar(filtered, fromHash);
  const fromHashProject = filtered.find(p => p.id === fromHash);
  if (fromHashProject) {
    mainHome.classList.add("is-hidden");
    mainProject.classList.add("is-visible");
    renderMain(fromHashProject);
    setSidebarSelection(fromHash);
  } else {
    showDefaultView();
  }
}
init();

document.getElementById("brand-link").addEventListener("click", (e) => {
  e.preventDefault();
  showDefaultView();
  window.scrollTo(0, 0);
});
