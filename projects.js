const PROJECTS = [
  {
    id: "p-2025-6",
    status: "in-progress",
    year: 2025,
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
    id: "p-2026-04",
    status: "in-progress",
    year: 2026,
    title: "카카오톡 맞춤형 요약 봇",
    summary: "기존 Discord 요약 봇을 확장한 사용자 구독형 카카오톡 요약 서비스",
    meta: "Python · PostgreSQL · FastAPI",
    project_info: "기존 Discord 커뮤니티 요약 봇에서 구축한 수집·요약 파이프라인을 기반으로,IT/시사 등 더 넓은 범위를 다루는 카카오톡 구독형 요약 서비스로 확장",
    body: [
      {
        title: "기존 Discord 봇 아키텍처 확장",
        desc: "기존 수집/요약/큐 처리 구조를 재사용해 카카오톡 채널에 맞는 전달 구조로 전환",
      },
      {
        title: "멀티 소스 수집 범위 확대",
        desc: "커뮤니티 중심 수집에서 IT·시사·뉴스 등 다양한 소스로 확장 가능한 구조 설계",
      },
      {
        title: "사용자 구독 기반 개인화",
        desc: "관심 주제/키워드/발송 주기를 설정해 필요한 요약만 받아보는 구독 기능 구현",
      },
      {
        title: "카카오톡 정기 발송 자동화",
        desc: "구독 조건에 맞는 요약 콘텐츠를 주기적으로 카카오톡으로 전달하는 자동 발송 기능 개발",
      },
    ],
    links: [
      { label: "GitHub", url: "https://github.com/HSHyun/ktbot" }
    ]
  },
  {
    id: "p-2026-99",
    status: "in-progress",
    year: 2026,
    title: "프로젝트 아카이브",
    summary: "프로젝트 아카이브 사이트 제작",
    meta: "HTML · CSS · JavaScript",
    project_info: "연도별로 정리한 프로젝트 아카이브 제작하기 프로젝트",
    body: [
      {
        title: "프로젝트 아카이브 설계",
        desc: "과거 프로젝트 내역 수집/정리 후 구조화",
      },
      {
        title: "사이트 IA/UI 설계",
        desc: "웹 구성 및 디자인 시스템 정리",
      },
      {
        title: "정적 홈페이지 구현",
        desc: "GitHub Pages 기반으로 배포 가능한 구조로 제작(HTML/CSS/JS)"
      },
      {
        title: "콘텐츠 등록/유지보수 흐름 구축",
        desc: "projects.js에 데이터 추가만으로 자동 렌더링되도록 구성"
      },
      {
        title: "AI 활용",
        desc: "레이아웃/컴포넌트 초안 생성에 AI를 활용하고 이후 직접 조정"
      }
    ],
    gallery: [
      "images/portfolio/1.jpg",
      "images/portfolio/2.jpg"
    ],
    links: [
      { label: "GitHub", url: "https://github.com/HSHyun/portfolio" },
      { label: "Site", url: "https://hshyun.github.io/portfolio" }, 
    ]
  },
  {
    id: "p-2025-11",
    status: "done",
    year: 2025,
    title: "커뮤니티 요약 AI Discord 봇",
    summary: "커뮤니티 크롤링 기반 자동 요약 디스코드 봇 개발",
    meta: "Python · PostgreSQL · RabbitMQ · Discord",
    project_info: "커뮤니티 글 수집 → 요약 생성 → 디스코드 전송까지 자동화한 파이프라인 프로젝트",
    body: [
      {
        title: "크롤링 파이프라인 구축",
        desc: "커뮤니티 게시물을 수집하고 DB에 저장하는 수집 파이프라인 구현",
      },
      {
        title: "워커/큐 기반 비동기 처리",
        desc: "RabbitMQ 기반 워커로 본문·댓글·이미지 처리 및 요약 작업 비동기화",
      },
      {
        title: "요약 및 전송 자동화",
        desc: "Gemini API로 요약 생성 후 Discord 봇 명령어(digest/best)와 자동 알림 기능 구현",
      },
      {
        title: "배포 및 운영",
        desc: "AWS EC2/RDS 연동으로 24시간 실행 가능한 운영 환경 구성",
      },
    ],
    gallery: [
      "images/discordbot/1.png",
      "images/discordbot/2.png",
      "images/discordbot/3.png",
      "images/discordbot/4.png",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/HSHyun/discordbot" },
    ],
  },
  
];
