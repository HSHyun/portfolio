const inProgressEl = document.getElementById("in-progress-list");
const doneYearsEl = document.getElementById("done-years");

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

function splitByStatus(items){
  const inProgress = [];
  const done = [];

  items.forEach((item) => {
    if (item.status === "in-progress") {
      inProgress.push(item);
      return;
    }

    if (item.status === "done" || !item.status) {
      done.push(item);
      return;
    }

    console.warn(`[portfolio] Unknown status "${item.status}" for project "${item.id}".`);
  });

  return { inProgress, done };
}

function createProjectItem(project, selectedId){
  const li = document.createElement("li");
  const btn = document.createElement("button");

  btn.type = "button";
  btn.className = "item-btn";
  btn.setAttribute("data-id", project.id);
  btn.setAttribute("aria-selected", String(project.id === selectedId));
  btn.innerHTML = `
    <span class="marker" aria-hidden="true"></span>
    <span class="item-text">
      <p class="item-title">${escapeHtml(project.title)}</p>
      <p class="item-meta">${escapeHtml(project.meta || project.summary || "")}</p>
    </span>
  `;
  btn.addEventListener("click", () => selectProject(project.id, true));

  li.appendChild(btn);
  return li;
}

function renderSidebar(items, selectedId){
  inProgressEl.innerHTML = "";
  doneYearsEl.innerHTML = "";
  const { inProgress, done } = splitByStatus(items);

  if (inProgress.length > 0) {
    inProgress.forEach((project) => {
      inProgressEl.appendChild(createProjectItem(project, selectedId));
    });
  } else {
    const empty = document.createElement("li");
    empty.className = "sidebar-empty";
    empty.textContent = "진행중 항목이 없습니다.";
    inProgressEl.appendChild(empty);
  }

  const grouped = groupByYear(done);
  if (grouped.length === 0) {
    const empty = document.createElement("p");
    empty.className = "sidebar-empty";
    empty.textContent = "완료 항목이 없습니다.";
    doneYearsEl.appendChild(empty);
  }

  grouped.forEach(([year, arr]) => {
    const hasSelected = arr.some((project) => project.id === selectedId);
    const block = document.createElement("div");
    block.className = hasSelected ? "year-block" : "year-block collapsed";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "year-toggle";
    toggleBtn.setAttribute("aria-expanded", hasSelected ? "true" : "false");
    toggleBtn.innerHTML = `<span class="year-toggle-icon" aria-hidden="true">${hasSelected ? "▼" : "▶"}</span><span class="year-num">${year}</span>`;
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
      ul.appendChild(createProjectItem(p, selectedId));
    });

    block.appendChild(toggleBtn);
    block.appendChild(ul);
    doneYearsEl.appendChild(block);
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
  document.querySelectorAll(".item-btn").forEach(btn => {
    const id = btn.getAttribute("data-id");
    btn.setAttribute("aria-selected", String(id === selectedId));
  });
}

function showDefaultView(updateUrl = false){
  mainHome.classList.remove("is-hidden");
  mainProject.classList.remove("is-visible");
  setSidebarSelection("");
  if (updateUrl) {
    history.pushState({}, "", "#projects");
  }
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
    showDefaultView(false);
  }
});

function init() {
  const fromHash = location.hash ? decodeURIComponent(location.hash.slice(1)) : "";
  renderSidebar(PROJECTS, fromHash);
  const fromHashProject = PROJECTS.find(p => p.id === fromHash);
  if (fromHashProject) {
    mainHome.classList.add("is-hidden");
    mainProject.classList.add("is-visible");
    renderMain(fromHashProject);
    setSidebarSelection(fromHash);
  } else {
    showDefaultView(false);
  }
}
init();

document.getElementById("brand-link").addEventListener("click", (e) => {
  e.preventDefault();
  showDefaultView(true);
  window.scrollTo(0, 0);
});
