import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

function parseArgs(argv) {
  const result = {
    projects: "projects.js",
    out: "data/github-snapshot.json",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    if (token === "--projects" && next) {
      result.projects = next;
      i += 1;
      continue;
    }
    if (token === "--out" && next) {
      result.out = next;
      i += 1;
      continue;
    }
  }
  return result;
}

function inferCommitType(message) {
  const lower = String(message || "").toLowerCase();
  if (lower.startsWith("feat")) return "feat";
  if (lower.startsWith("fix")) return "fix";
  if (lower.startsWith("docs")) return "docs";
  if (lower.startsWith("refactor")) return "refactor";
  return "feat";
}

function formatCommitDate(isoString) {
  if (!isoString) return "-";
  return String(isoString).replace("T", " ").slice(0, 16);
}

function computeLanguageBreakdown(languagesObj) {
  if (!languagesObj || typeof languagesObj !== "object") return [];
  const entries = Object.entries(languagesObj).filter(([, bytes]) => Number(bytes) > 0);
  if (entries.length === 0) return [];

  const total = entries.reduce((sum, [, bytes]) => sum + Number(bytes), 0);
  if (total <= 0) return [];

  const sorted = entries.sort((a, b) => Number(b[1]) - Number(a[1]));
  const topThree = sorted.slice(0, 3).map(([name, bytes], index) => ({
    name,
    percent: Math.round((Number(bytes) / total) * 100),
    tone: `lang-tone-${index + 1}`,
    bytes: Number(bytes),
  }));

  const restBytes = sorted.slice(3).reduce((sum, [, bytes]) => sum + Number(bytes), 0);
  const result = topThree
    .filter((item) => item.percent > 0)
    .map(({ name, percent, tone }) => ({ name, percent, tone }));

  if (restBytes > 0) {
    const otherPercent = Math.round((restBytes / total) * 100);
    if (otherPercent > 0) {
      result.push({ name: "Other", percent: otherPercent, tone: "lang-tone-4" });
    }
  }
  return result;
}

function extractGithubRepoInfoFromProject(project) {
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

async function loadProjects(projectsPath) {
  const code = await fs.readFile(projectsPath, "utf8");
  const sandbox = {
    module: { exports: null },
    exports: {},
  };
  vm.runInNewContext(`${code}\nmodule.exports = PROJECTS;`, sandbox, { filename: projectsPath });
  if (!Array.isArray(sandbox.module.exports)) {
    throw new Error("PROJECTS 배열을 로드하지 못했습니다.");
  }
  return sandbox.module.exports;
}

function buildRequestHeaders(token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-snapshot-updater",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function fetchGithubCommits(config, headers) {
  const url = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/commits?sha=${encodeURIComponent(config.branch)}&per_page=30`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`commits API failed: ${response.status} (${config.owner}/${config.repo})`);
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

async function fetchGithubLanguages(config, headers) {
  const url = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/languages`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`languages API failed: ${response.status} (${config.owner}/${config.repo})`);
  }
  return response.json();
}

async function main() {
  const { projects, out } = parseArgs(process.argv.slice(2));
  const projectsPath = path.resolve(projects);
  const outputPath = path.resolve(out);
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
  const headers = buildRequestHeaders(token);

  const projectList = await loadProjects(projectsPath);
  const repoMap = new Map();

  for (const project of projectList) {
    const info = extractGithubRepoInfoFromProject(project);
    if (!info) continue;
    const key = `${info.owner}/${info.repo}#${info.branch}`;
    if (!repoMap.has(key)) repoMap.set(key, info);
  }

  const output = {
    schema_version: 1,
    repos: {},
  };

  const keys = Array.from(repoMap.keys()).sort((a, b) => a.localeCompare(b));
  for (const key of keys) {
    const info = repoMap.get(key);
    const [commits, languagesRaw] = await Promise.all([
      fetchGithubCommits(info, headers),
      fetchGithubLanguages(info, headers),
    ]);
    output.repos[key] = {
      owner: info.owner,
      repo: info.repo,
      branch: info.branch,
      commits,
      languages: computeLanguageBreakdown(languagesRaw),
    };
    console.log(`[snapshot] updated ${key}`);
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`[snapshot] wrote ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
