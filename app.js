const inProgressEl = document.getElementById("in-progress-list");
const doneYearsEl = document.getElementById("done-years");

const mainHome = document.getElementById("main-home");
const mainProject = document.getElementById("main-project");
const lightboxEl = document.getElementById("lightbox");
const lightboxImageEl = document.getElementById("lightbox-image");
const lightboxCloseEl = document.getElementById("lightbox-close");
const lightboxPrevEl = document.getElementById("lightbox-prev");
const lightboxNextEl = document.getElementById("lightbox-next");
const ui = {
  kicker: document.getElementById("kicker"),
  title: document.getElementById("title"),
  desc: document.getElementById("desc"),
  hero: document.getElementById("hero"),
  chips: document.getElementById("chips"),
  projectBody: document.getElementById("project-body"),
  whatIdBody: document.getElementById("whatid-body"),
  links: document.getElementById("links"),
};
let heroRenderToken = 0;
const repoDataCache = new Map();
const repoDataPromiseCache = new Map();
let snapshotDataPromise = null;
let snapshotData = null;
let lightboxImages = [];
let lightboxIndex = 0;

const DEFAULT_SNAPSHOT_URLS = (() => {
  const override = (typeof window !== "undefined" && typeof window.PORTFOLIO_SNAPSHOT_URL === "string")
    ? window.PORTFOLIO_SNAPSHOT_URL.trim()
    : "";

  const host = (typeof location !== "undefined" && location.hostname) ? location.hostname : "";
  const owner = host.endsWith(".github.io") ? host.split(".")[0] : "";
  const rawUrl = owner
    ? `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(owner)}.github.io/data/data/github-snapshot.json`
    : "";

  return [override, rawUrl, "data/github-snapshot.json"].filter(Boolean);
})();

const DUMMY_COMMITS = [
  {
    type: "feat",
    repo: "JPStudy",
    branch: "main",
    author: "HSHyun",
    date: "2026-02-22 21:04",
    message: "학습 카드 목록 UI 추가 및 레이아웃 밀도 조정",
    sha: "4b9f2a1",
  },
  {
    type: "fix",
    repo: "JPStudy",
    branch: "main",
    author: "HSHyun",
    date: "2026-02-22 20:27",
    message: "복습 버튼 클릭 시 상태 꼬임 이슈 수정",
    sha: "2d6ac88",
  },
  {
    type: "docs",
    repo: "JPStudy",
    branch: "main",
    author: "HSHyun",
    date: "2026-02-21 23:48",
    message: "README에 학습 플로우 및 데이터 구조 정리",
    sha: "9f13ca7",
  },
  {
    type: "refactor",
    repo: "JPStudy",
    branch: "main",
    author: "HSHyun",
    date: "2026-02-21 22:12",
    message: "프로젝트/커밋 렌더 로직 함수 분리",
    sha: "7ce54ab",
  },
  {
    type: "feat",
    repo: "JPStudy",
    branch: "main",
    author: "HSHyun",
    date: "2026-02-20 18:35",
    message: "단어 학습 상세 페이지 레이아웃 추가",
    sha: "fd91a70",
  },
  {
    type: "fix",
    repo: "JPStudy",
    branch: "main",
    author: "HSHyun",
    date: "2026-02-20 16:20",
    message: "모바일에서 사이드바 접힘 상태 유지 버그 수정",
    sha: "8e2c4f1",
  },
  {
    type: "docs",
    repo: "JPStudy",
    branch: "main",
    author: "HSHyun",
    date: "2026-02-19 23:14",
    message: "데이터 필드 정의 및 예시 문서 업데이트",
    sha: "cf16c5b",
  },
  {
    type: "refactor",
    repo: "JPStudy",
    branch: "main",
    author: "HSHyun",
    date: "2026-02-19 21:41",
    message: "컴포넌트 스타일 변수 통합",
    sha: "a6712dd",
  },
  {
    type: "feat",
    repo: "JPStudy",
    branch: "main",
    author: "HSHyun",
    date: "2026-02-18 19:05",
    message: "학습 진도 퍼센트 표시 추가",
    sha: "319db64",
  },
  {
    type: "fix",
    repo: "JPStudy",
    branch: "main",
    author: "HSHyun",
    date: "2026-02-18 17:32",
    message: "검색 결과 없을 때 빈 상태 안내 개선",
    sha: "6c2459e",
  },
  {
    type: "docs",
    repo: "JPStudy",
    branch: "main",
    author: "HSHyun",
    date: "2026-02-17 22:03",
    message: "프로젝트 구조 다이어그램 정리",
    sha: "4d5bf27",
  },
];

function inferCommitType(message){
  const lower = String(message || "").toLowerCase();
  if (lower.startsWith("feat")) return "feat";
  if (lower.startsWith("fix")) return "fix";
  if (lower.startsWith("docs")) return "docs";
  if (lower.startsWith("refactor")) return "refactor";
  return "feat";
}

function formatCommitDate(isoString){
  if (!isoString) return "-";
  return isoString.replace("T", " ").slice(0, 16);
}

async function fetchGithubCommits(config){
  const url = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/commits?sha=${encodeURIComponent(config.branch)}&per_page=${encodeURIComponent(config.perPage)}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status}`);
  }

  const commits = await response.json();
  return commits.map((item) => {
    const message = item?.commit?.message?.split("\n")[0] || "(no message)";
    const date = item?.commit?.committer?.date || item?.commit?.author?.date || "";
    return {
      type: inferCommitType(message),
      repo: config.repo,
      branch: config.branch,
      author: item?.commit?.author?.name || item?.author?.login || "unknown",
      date: formatCommitDate(date),
      message,
      sha: (item?.sha || "").slice(0, 7),
    };
  });
}

async function fetchGithubLanguages(config){
  const url = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/languages`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub languages request failed: ${response.status}`);
  }

  return response.json();
}

function computeLanguageBreakdown(languagesObj){
  if (!languagesObj || typeof languagesObj !== "object") return [];
  const entries = Object.entries(languagesObj).filter(([, bytes]) => Number(bytes) > 0);
  if (entries.length === 0) return [];

  const total = entries.reduce((sum, [, bytes]) => sum + Number(bytes), 0);
  if (total <= 0) return [];

  const sorted = entries.sort((a, b) => Number(b[1]) - Number(a[1]));
  const topThree = sorted.slice(0, 3).map(([name, bytes], index) => {
    const percent = Math.round((Number(bytes) / total) * 100);
    return {
      name,
      percent,
      tone: `lang-tone-${index + 1}`,
      bytes: Number(bytes),
    };
  });

  const restBytes = sorted.slice(3).reduce((sum, [, bytes]) => sum + Number(bytes), 0);
  const result = topThree.filter((item) => item.percent > 0).map(({ name, percent, tone }) => ({
    name,
    percent,
    tone,
  }));

  if (restBytes > 0) {
    const otherPercent = Math.round((restBytes / total) * 100);
    if (otherPercent > 0) {
      result.push({
        name: "Other",
        percent: otherPercent,
        tone: "lang-tone-4",
      });
    }
  }

  return result;
}

function extractGithubRepoInfo(project){
  const links = project?.links || [];
  for (const link of links) {
    const rawUrl = link?.url || "";
    if (!rawUrl) continue;

    let parsed;
    try {
      parsed = new URL(rawUrl);
    } catch {
      continue;
    }

    if (!parsed.hostname.toLowerCase().includes("github.com")) continue;
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) continue;

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/i, "");
    if (!owner || !repo) continue;

    let branch = "main";
    if (parts[2] === "tree" && parts[3]) {
      branch = parts[3];
    }

    return { owner, repo, branch };
  }
  return null;
}

async function loadSnapshotData(){
  if (snapshotData) return snapshotData;
  if (snapshotDataPromise) return snapshotDataPromise;

  snapshotDataPromise = (async () => {
    for (const url of DEFAULT_SNAPSHOT_URLS) {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) continue;
        const json = await response.json();
        if (json && typeof json === "object") {
          snapshotData = json;
          return snapshotData;
        }
      } catch {
        // noop
      }
    }
    snapshotData = null;
    return null;
  })();

  return snapshotDataPromise;
}

function getSnapshotRepoEntry(snapshot, repoInfo){
  if (!snapshot || typeof snapshot !== "object") return null;
  const repoMap = snapshot.repos;
  if (!repoMap || typeof repoMap !== "object") return null;

  const keyWithBranch = `${repoInfo.owner}/${repoInfo.repo}#${repoInfo.branch}`;
  if (repoMap[keyWithBranch]) return repoMap[keyWithBranch];

  const keyWithoutBranch = `${repoInfo.owner}/${repoInfo.repo}`;
  if (repoMap[keyWithoutBranch]) return repoMap[keyWithoutBranch];

  return null;
}

async function resolveProjectData(project){
  const repoInfo = extractGithubRepoInfo(project);
  if (!repoInfo) {
    return { status: "no-repo", commits: [], languages: [] };
  }

  const key = `${repoInfo.owner}/${repoInfo.repo}#${repoInfo.branch}`;
  if (repoDataCache.has(key)) {
    const cached = repoDataCache.get(key);
    return { status: "ok", commits: cached.commits, languages: cached.languages };
  }

  if (repoDataPromiseCache.has(key)) {
    return repoDataPromiseCache.get(key);
  }

  const pending = (async () => {
    try {
      const snapshot = await loadSnapshotData();
      const snapshotEntry = getSnapshotRepoEntry(snapshot, repoInfo);
      if (snapshotEntry) {
        const commits = Array.isArray(snapshotEntry.commits) ? snapshotEntry.commits : [];
        const languages = Array.isArray(snapshotEntry.languages) ? snapshotEntry.languages : [];
        repoDataCache.set(key, { commits, languages });
        return { status: "ok", commits, languages };
      }

      const [commitsResult, languagesResult] = await Promise.allSettled([
        fetchGithubCommits({
          owner: repoInfo.owner,
          repo: repoInfo.repo,
          branch: repoInfo.branch,
          perPage: 30,
        }),
        fetchGithubLanguages({
          owner: repoInfo.owner,
          repo: repoInfo.repo,
        }),
      ]);

      if (commitsResult.status !== "fulfilled") {
        console.warn("[portfolio] Failed to load project commits.", commitsResult.reason);
        return { status: "error", commits: [], languages: [] };
      }

      const commits = commitsResult.value;
      const languages = languagesResult.status === "fulfilled"
        ? computeLanguageBreakdown(languagesResult.value)
        : [];

      if (languagesResult.status !== "fulfilled") {
        console.warn("[portfolio] Failed to load project languages.", languagesResult.reason);
      }

      repoDataCache.set(key, { commits, languages });
      return { status: "ok", commits, languages };
    } finally {
      repoDataPromiseCache.delete(key);
    }
  })();

  repoDataPromiseCache.set(key, pending);
  return pending;
}

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
  const token = ++heroRenderToken;
  ui.kicker.textContent = `${p.year} · ${p.meta ?? ""}`.trim().replace(/\s·\s$/, "");
  ui.title.textContent = p.title;
  ui.desc.textContent = p.summary ?? "";

  renderHeroPanel(p, [], "커밋 내역을 불러오는 중...");
  resolveProjectData(p).then((result) => {
    if (token !== heroRenderToken) return;

    if (result.status === "no-repo") {
      renderHeroPanel(p, [], "레포가 없는 프로젝트");
      return;
    }

    if (result.status === "error") {
      renderHeroPanel(p, [], "커밋 내역을 불러오지 못했습니다.");
      return;
    }

    if (!result.commits || result.commits.length === 0) {
      renderHeroPanel(p, [], "커밋 내역이 없습니다.");
      return;
    }

      renderHeroPanel(p, result.commits, "", result.languages || []);
  });
  ui.chips.innerHTML = "";
  ui.chips.style.display = "none";

  const projectText = String(p.project_info ?? "").trim();
  ui.projectBody.textContent = projectText || "프로젝트 설명이 아직 없습니다.";
  ui.whatIdBody.innerHTML = buildWhatIdMarkup(p.body);
  ui.links.innerHTML = "";
  const visibleLinks = (p.links || []).filter((l) => {
    const label = String(l?.label || "").trim().toLowerCase();
    return label !== "github";
  });

  visibleLinks.forEach(l => {
    const a = document.createElement("a");
    a.className = "btn";
    a.href = l.url;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.textContent = l.label;
    ui.links.appendChild(a);
  });

  if (visibleLinks.length === 0) {
    ui.links.style.display = "none";
  } else {
    ui.links.style.display = "flex";
  }
}

function buildWhatIdMarkup(body){
  if (Array.isArray(body)) {
    const items = body
      .map((item) => ({
        title: String(item?.title ?? "").trim(),
        desc: String(item?.desc ?? "").trim(),
      }))
      .filter((item) => item.title || item.desc);

    if (items.length > 0) {
      return items.map((item) => `
        <li>
          ${item.title ? `<p class="whatid-item-title">${escapeHtml(item.title)}</p>` : ""}
          ${item.desc ? `<p class="whatid-item-desc">${escapeHtml(item.desc)}</p>` : ""}
        </li>
      `).join("");
    }
  }

  const whatIdText = String(body ?? "").trim();
  if (!whatIdText) {
    return "<li><p class=\"whatid-item-title\">세부 작업 내용을 곧 정리할게요.</p></li>";
  }

  const items = whatIdText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return items.map((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const label = line.slice(0, colonIndex).trim();
      const rest = line.slice(colonIndex + 1).trim();
      return `<li><p class="whatid-item-title"><strong>${escapeHtml(label)}:</strong>${rest ? ` ${escapeHtml(rest)}` : ""}</p></li>`;
    }
    return `<li><p class="whatid-item-title">${escapeHtml(line)}</p></li>`;
  }).join("");
}

function buildCommitItemsMarkup(items){
  if (!items || items.length === 0) {
    return `<li class="sidebar-empty">커밋 데이터가 없습니다.</li>`;
  }

  return items
    .map((commit, index) => {
      const type = escapeHtml(commit.type || "feat");
      const branch = escapeHtml(commit.branch || "-");
      const date = escapeHtml(commit.date || "-");
      const message = escapeHtml(commit.message || "-");
      const latestClass = index === 0 ? " commit-item--latest" : "";

      return `
        <li class="commit-item${latestClass}">
          <div class="commit-graph">
            <span class="commit-node commit-node-${type}" aria-hidden="true"></span>
          </div>
          <article class="commit-card">
            <p class="commit-message">${message}</p>
            <div class="commit-sub">
              <p class="commit-meta">${branch} - ${date}</p>
              <span class="commit-kind commit-kind-${type}">${type}</span>
            </div>
          </article>
        </li>`;
    })
    .join("");
}

function buildGalleryItemsMarkup(project){
  const gallery = Array.isArray(project.gallery) ? project.gallery : [];
  if (gallery.length === 0) {
    return `
      <figure class="hero-gallery-item hero-gallery-item--empty">
        <div class="hero-gallery-empty">
          등록한 사진이 아직 없습니다. 곧 추가할게요.
        </div>
      </figure>`;
  }

  return gallery
    .map((src, index) => {
      const safeSrc = escapeHtml(String(src));
      const alt = escapeHtml(`${project.title} 이미지 ${index + 1}`);
      return `
        <figure class="hero-gallery-item">
          <img src="${safeSrc}" alt="${alt}" loading="lazy" />
        </figure>`;
    })
    .join("");
}

function bindHeroGallerySlider(){
  const track = ui.hero.querySelector(".hero-gallery-track");
  const prev = ui.hero.querySelector("[data-slide='prev']");
  const next = ui.hero.querySelector("[data-slide='next']");
  if (!track || !prev || !next) return;

  const amount = () => Math.max(260, Math.floor(track.clientWidth * 0.85));
  prev.addEventListener("click", () => {
    track.scrollBy({ left: -amount(), behavior: "smooth" });
  });
  next.addEventListener("click", () => {
    track.scrollBy({ left: amount(), behavior: "smooth" });
  });
}

function updateLightboxImage(){
  if (!lightboxImageEl || lightboxImages.length === 0) return;
  const current = lightboxImages[lightboxIndex];
  if (!current) return;
  lightboxImageEl.src = current.src;
  lightboxImageEl.alt = current.alt || "확대 이미지";
}

function openLightbox(index){
  if (!lightboxEl || lightboxImages.length === 0) return;
  lightboxIndex = Math.max(0, Math.min(index, lightboxImages.length - 1));
  updateLightboxImage();
  lightboxEl.classList.add("is-open");
  lightboxEl.setAttribute("aria-hidden", "false");
}

function closeLightbox(){
  if (!lightboxEl) return;
  lightboxEl.classList.remove("is-open");
  lightboxEl.setAttribute("aria-hidden", "true");
}

function moveLightbox(step){
  if (lightboxImages.length === 0) return;
  lightboxIndex = (lightboxIndex + step + lightboxImages.length) % lightboxImages.length;
  updateLightboxImage();
}

function bindLightboxForHeroGallery(){
  const imgs = Array.from(ui.hero.querySelectorAll(".hero-gallery-item img"));
  lightboxImages = imgs.map((img) => ({
    src: img.currentSrc || img.src,
    alt: img.alt || "확대 이미지",
  }));
  imgs.forEach((img, index) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openLightbox(index));
  });
}

function renderHeroPanel(project, commits, note, languages = []){
  const slicedCommits = (commits || []).slice(0, 10);
  const commitMarkup = note
    ? `<li class="sidebar-empty">${escapeHtml(note)}</li>`
    : buildCommitItemsMarkup(slicedCommits);

  const galleryMarkup = buildGalleryItemsMarkup(project);
  const allCommits = commits || [];
  const latestDate = allCommits[0]?.date || "-";
  const totalCommits = allCommits.length;

  const repoInfo = extractGithubRepoInfo(project);
  const summary = note ? "Status" : "Recent commits";
  const showMetrics = Boolean(repoInfo) && !note;
  const languageBarMarkup = showMetrics && languages.length > 0
    ? `
      <div class="lang-panel">
        <p class="lang-title">Languages</p>
        <div class="lang-track">
          ${languages.map((item) => `<span class="lang-segment ${item.tone}" style="width:${item.percent}%"></span>`).join("")}
        </div>
        <div class="lang-legend">
          ${languages.map((item) => `<span class="lang-chip"><i class="lang-dot ${item.tone}" aria-hidden="true"></i>${escapeHtml(item.name)} ${escapeHtml(String(item.percent))}%</span>`).join("")}
        </div>
      </div>
    `
    : `
      <div class="lang-panel">
        <p class="lang-title">Languages</p>
        <p class="gh-empty">표시할 언어 정보가 없어요.</p>
      </div>
    `;
  const repoMarkup = repoInfo
    ? `
      <div class="gh-row"><span class="gh-k">repo</span><span class="gh-v">${escapeHtml(repoInfo.owner + "/" + repoInfo.repo)}</span></div>
      <div class="gh-row"><span class="gh-k">branch</span><span class="gh-v">${escapeHtml(repoInfo.branch)}</span></div>
      <div class="gh-row"><span class="gh-k">latest</span><span class="gh-v">${showMetrics ? escapeHtml(latestDate) : "-"}</span></div>
      <div class="gh-row"><span class="gh-k">commits</span><span class="gh-v">${showMetrics ? escapeHtml(String(totalCommits)) : "-"}</span></div>
      <div class="gh-row"><span class="gh-k">link</span><a class="gh-link" href="https://github.com/${encodeURIComponent(repoInfo.owner)}/${encodeURIComponent(repoInfo.repo)}" target="_blank" rel="noreferrer">Open on GitHub →</a></div>
      ${languageBarMarkup}
      
    `
    : `
      <div class="gh-row"><span class="gh-k">repo</span><span class="gh-v">-</span></div>
      <div class="gh-row"><span class="gh-k">branch</span><span class="gh-v">-</span></div>
      <div class="gh-row"><span class="gh-k">latest</span><span class="gh-v">-</span></div>
      <div class="gh-row"><span class="gh-k">commits</span><span class="gh-v">-</span></div>
      <div class="gh-row"><span class="gh-k">link</span><span class="gh-empty">GitHub 링크가 없어요.</span></div>
      ${languageBarMarkup}
    `;

  ui.hero.classList.add("hero--panel");
  ui.hero.innerHTML = `
    <div class="hero-split">
      <section class="hero-gallery" aria-label="프로젝트 이미지 슬라이드">
        <div class="hero-gallery-track">
          ${galleryMarkup}
        </div>
        <div class="hero-gallery-controls">
          <button type="button" class="hero-gallery-btn" data-slide="prev" aria-label="이전 이미지">‹</button>
          <button type="button" class="hero-gallery-btn" data-slide="next" aria-label="다음 이미지">›</button>
        </div>
      </section>

      <div class="hero-right">
        <section class="commit-board commit-board--hero" aria-label="커밋 타임라인">
          <div class="commit-board-head commit-board-head--hero">
            <p class="commit-board-title">Development Log</p>
            <p class="commit-board-summary">${escapeHtml(summary)}</p>
          </div>
          <ul class="commit-list commit-list--hero">
            ${commitMarkup}
          </ul>
        </section>

        <section class="gh-board" aria-label="GitHub 요약">
          <div class="gh-head">
            <p class="gh-title">GitHub</p>
            <p class="gh-sub">Repository Snapshot</p>
          </div>
          <div class="gh-body">
            ${repoMarkup}
          </div>
        </section>
      </div>
    </div>
  `;

  bindHeroGallerySlider();
  bindLightboxForHeroGallery();
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
  ui.links.style.display = "none";
  ui.links.innerHTML = "";
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

if (lightboxCloseEl) {
  lightboxCloseEl.addEventListener("click", closeLightbox);
}
if (lightboxPrevEl) {
  lightboxPrevEl.addEventListener("click", () => moveLightbox(-1));
}
if (lightboxNextEl) {
  lightboxNextEl.addEventListener("click", () => moveLightbox(1));
}
if (lightboxEl) {
  lightboxEl.addEventListener("click", (e) => {
    if (e.target === lightboxEl) closeLightbox();
  });
}
window.addEventListener("keydown", (e) => {
  if (!lightboxEl || !lightboxEl.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") moveLightbox(-1);
  if (e.key === "ArrowRight") moveLightbox(1);
});

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

async function init() {
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
