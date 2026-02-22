const PROJECTS = [
  {
    id: "p-2026-01",
    status: "in-progress",
    year: 2026,
    title: "영어 학습 앱 Running",
    summary: "수능 영어 분석 + 변형문제 생성 AI 서비스",
    meta: "Android & Backend",
    project_info: "중·고등 영어 내신/수능을 대상으로, 지문의 구문분석지와 번형문제를 AI를 통해 생성해주는 학습 지원 시스템 개발 프로젝트.",
    body: [
      {
        title: "태블릿 기반 Android 앱 전면 개발 (Kotlin)",
        desc: "촬영/업로드 중심 학습 플로우와 게시글 UI/UX 설계 및 구현",
      },
      {
        title: "백엔드 전면 개발",
        desc: "게시글/학습 데이터 API, OCR 원문 데이터 저장·조회 API 구축 및 DB 연동",
      },
      {
        title: "이미지 업로드 파이프라인 구현",
        desc: "멀티파트 업로드, 서버 저장 및 처리 흐름 구성",
      },
      {
        title: "OCR 비동기 처리 아키텍처 적용",
        desc: "업로드 후 결과를 조회하는 비동기 API 흐름 제공",
      },
      {
        title: "클라우드 배포 (Azure)",
        desc: "Docker 기반 서버 컨테이너화 후 Azure 환경 배포 및 운영 구성",
      },
    ],
    gallery: [
      "images/running/1.png",
      "images/running/2.png",
      "images/running/3.png",
      "images/running/4.png",
      "images/running/5.png",
      "images/running/6.png",
      "images/running/7.png",
    ],
    links: [
      {label: "Github", url: "https://github.com/HSHyun/capstone"}
    ]
  },
  {
    id: "p-2026-02",
    status: "in-progress",
    year: 2026,
    title: "일본어 학습 사이트",
    summary: "일본어 학습 사이트 개발",
    meta: "Python · PostgreSQL",
    tags: ["Personal Project", "Python", "PostgreSQL", "FastAPI", "Supabase"],
    body: [
      {
        title: "일본어 학습 사이트 개발",
        desc: "학습/복습 중심 UI 구성과 페이지 흐름 설계",
      },
      {
        title: "백엔드 및 DB 구축",
        desc: "Python 기반 API와 PostgreSQL 연동 구조 설계",
      },
    ],
    links: [
      { label: "GitHub", url: "https://github.com/HSHyun/JPStudy" },
      { label: "Site", url: "https://hshyun.github.io/JPStudy/" }, 
    ]
  },
  {
    id: "p-2025-01",
    status: "done",
    year: 2025,
    title: "개인 프로젝트: 포트폴리오 아카이브",
    summary: "연도별 프로젝트 정리 + 상세 뷰",
    meta: "Web · HTML/CSS/JS",
    tags: ["HTML", "CSS", "JavaScript"],
    body: [
      {
        title: "아카이브 UI 구조 설계",
        desc: "Figma로 정보 구조를 먼저 잡고 연도/상세 탐색 흐름을 정리",
      },
      {
        title: "데이터 기반 렌더 구조 구현",
        desc: "리스트/상세가 데이터에 따라 바뀌도록 구성하고 확장성을 확보",
      },
    ],
    links: []
  },
  {
    id: "p-2024-016",
    status: "done",
    year: 2024,
    title: "스터디: JS 미니 토이프로젝트 모음",
    summary: "작게 여러 개 만들어본 기록",
    meta: "Web · Study",
    tags: ["JavaScript", "Toy Project"],
    body: [
      {
        title: "JS 미니 프로젝트 아카이빙",
        desc: "작은 기능 단위 실험 결과를 한 페이지에서 탐색 가능하게 정리",
      },
    ],
    links: []
  }, {
    id: "p-2024-0121",
    status: "done",
    year: 2024,
    title: "스터디: JS 미니 토이프로젝트 모음",
    summary: "작게 여러 개 만들어본 기록",
    meta: "Web · Study",
    tags: ["JavaScript", "Toy Project"],
    body: [
      {
        title: "JS 미니 프로젝트 아카이빙",
        desc: "작은 기능 단위 실험 결과를 한 페이지에서 탐색 가능하게 정리",
      },
    ],
    links: []
  },
  {
    id: "p-2024-013",
    status: "done",
    year: 2024,
    title: "스터디: JS 미니 토이프로젝트 모음",
    summary: "작게 여러 개 만들어본 기록",
    meta: "Web · Study",
    tags: ["JavaScript", "Toy Project"],
    body: [
      {
        title: "JS 미니 프로젝트 아카이빙",
        desc: "작은 기능 단위 실험 결과를 한 페이지에서 탐색 가능하게 정리",
      },
    ],
    links: []
  },
  {
    id: "p-2024-012",
    status: "done",
    year: 2024,
    title: "스터디: JS 미니 토이프로젝트 모음",
    summary: "작게 여러 개 만들어본 기록",
    meta: "Web · Study",
    tags: ["JavaScript", "Toy Project"],
    body: [
      {
        title: "JS 미니 프로젝트 아카이빙",
        desc: "작은 기능 단위 실험 결과를 한 페이지에서 탐색 가능하게 정리",
      },
    ],
    links: []
  },
];
