# 포트폴리오

연도별 프로젝트를 정리해 보여주는 정적 포트폴리오 사이트입니다.

## 구성

- `index.html`: 페이지 기본 마크업
- `style.css`: 전체 레이아웃 및 컴포넌트 스타일
- `app.js`: 프로젝트 렌더링, 상세 뷰, 갤러리, GitHub 스냅샷 로딩
- `projects.js`: 포트폴리오에 표시할 프로젝트 데이터
- `scripts/generate-github-snapshot.mjs`: GitHub 커밋/언어 정보를 스냅샷으로 생성

## 동작 방식

프로젝트 목록과 상세 내용은 `projects.js`의 `PROJECTS` 배열을 기준으로 렌더링됩니다.

GitHub 커밋 내역은 페이지에서 스냅샷 JSON을 우선 읽고, 해당 레포 정보가 없을 때만 GitHub API를 직접 조회합니다.

GitHub Pages 프로젝트 배포 경로(`/portfolio`) 기준으로 현재 레포의 `data` 브랜치에 올라간 `data/github-snapshot.json`을 읽도록 구성되어 있습니다.

## 스냅샷 워크플로

`.github/workflows/update-github-snapshot.yml`가 주기적으로 실행되어:

1. `projects.js`에 등록된 GitHub 레포를 수집하고
2. 최신 커밋과 언어 정보를 가져와
3. `data/github-snapshot.json`을 생성한 뒤
4. `data` 브랜치에 푸시합니다.

## 비공개 레포지토리

private 레포까지 스냅샷에 포함하려면 repository secret `PORTFOLIO_GITHUB_TOKEN`을 설정해야 합니다.

이 토큰은 `projects.js`에 등록한 private 레포들을 읽을 수 있어야 하며, 생성된 스냅샷에 커밋 메시지와 메타데이터가 공개된다는 점을 전제로 사용해야 합니다.
