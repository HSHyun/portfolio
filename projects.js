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
    learned: [
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
    id: "p-2026-04",
    status: "done",
    year: 2026,
    title: "구독형 요약 서비스 확장",
    summary: "카카오톡 구독 인터페이스와 Discord 자동 발송을 결합한 사용자별 구독 기반 요약 서비스",
    meta: "Python · FastAPI · MySQL · Discord Bot",
    project_info:
      "기존 Discord 커뮤니티 요약 봇의 수집·요약 파이프라인을 기반으로 카카오톡 구독형 자동 요약 서비스를 목표로 개발했다. 개발 후반, 개인 프로젝트 환경에서는 카카오톡 일반 챗봇이 사용자에게 먼저 메시지를 보낼 수 없다는 제약을 확인하면서 카카오는 구독 관리와 온디맨드 조회 인터페이스로, 정기 발송은 Discord로 분리해 서비스 구조를 완성했다.",
    body: [
      {
        title: "기존 Discord 봇 아키텍처 확장",
        desc: "기존 수집, 요약, 큐 처리 구조를 재사용해 카카오톡과 Discord에서 함께 활용할 수 있는 구독형 서비스 구조로 확장했다.",
      },
      {
        title: "요약 파이프라인 고도화",
        desc: "게시물 본문, 댓글, 이미지까지 반영하는 1차 요약과 6시간·12시간·24시간 단위 digest 생성 흐름을 구현했다.",
      },
      {
        title: "카카오톡 구독 인터페이스 구현",
        desc: "카카오톡에서 구독 설정, 현재 설정 조회, 구독 해지, 온디맨드 digest 조회가 가능하도록 스킬 서버를 구성했다.",
      },
      {
        title: "Discord 자동 발송 기능 구현",
        desc: "사용자별 DM 구독, 채널별 구독, 최신 digest 조회, 정기 자동 발송 기능을 구현해 실제 발송 채널로 활용했다.",
      },
      {
        title: "운영 안정성 개선",
        desc: "KST 기준 슬롯 정렬, 누락된 digest 슬롯 백필, 응답 검증, 중복 발송 방지 로직을 정리해 운영 가능한 형태로 보완했다.",
      },
    ],
    learned: [
      {
        title: "Oracle Cloud와 실제 운영 환경 경험",
        desc: "Oracle Cloud Free Tier 서버 위에서 서비스를 구성했고, 점프 서버와 SSH 터널링을 이용해 내부 IP 기반 DB에 접근하는 방식까지 직접 경험했다. 단순히 로컬에서 코드를 실행하는 것과, 실제 서버 위에서 서비스와 DB를 연결하고 운영하는 것은 전혀 다른 문제라는 점을 체감했다.",
      },
      {
        title: "AI 코딩 도구는 \"생성\"보다 \"검수\"가 더 중요하다",
        desc: "초반에는 Codex나 Claude Code에게 기능 구현을 많이 맡겼지만, 충분히 검수하지 않은 채 계속 코드를 쌓다 보니 시간이 지나면서 내가 지금 어디를 수정하고 있는지조차 파악되지 않는 상태가 되었다. 이후 코드를 직접 정독하며 리팩토링하는 과정에서 100~200줄가량의 불필요한 헬퍼 함수와 과도한 방어 코드가 발견됐다. 이 경험을 통해 AI는 그럴듯해 보이는 코드를 빠르게 생성하는 도구일 뿐, 정확하고 정돈된 코드를 보장하는 도구는 아니라는 점을 분명히 배웠다.",
      },
      {
        title: "초기 설계와 플랫폼 검증의 중요성",
        desc: "프로젝트 후반부에 카카오톡 자동 발송이 개인 프로젝트 환경에서는 불가능하다는 사실을 뒤늦게 확인했다. 다행히 DB에는 크롤링 결과와 AI 요약 결과가 계속 저장되고 있었기 때문에 Discord 전환 자체는 어렵지 않았지만, 이 경험을 통해 플랫폼 제약이나 도구의 실제 사용 가능 여부는 반드시 초기에 먼저 검증해야 한다는 점을 배웠다. 또한 설계가 먼저 잡혀 있어야 AI에게도 더 정확한 지시를 줄 수 있고, 그 결과 더 정돈된 코드를 만들 수 있다는 점도 함께 느꼈다.",
      },
      {
        title: "AI 세션의 한계와 컨텍스트 관리",
        desc: "대화가 길어질수록 AI가 이전 내용을 잊거나 추론 품질이 떨어지는 현상을 자주 겪었다. 이는 마치 매일 새로운 개발자가 인수인계 문서도 없이 프로젝트를 이어받는 상황과 비슷했다. 이를 해결하기 위해 AGENTS.md 기반의 컨텍스트 관리 방식을 고안했고, 이후에는 진행 상황과 변경점을 tasks/todo.md와 lessons.md에 기록하도록 구조화했다. 새로운 세션이 시작될 때 이 파일들만 읽으면 이전 맥락을 최대한 이어갈 수 있도록 한 것이다. 또한 AI가 원하는 방향과 다른 코드를 생성했을 때도 단순히 수정 요청에서 끝내지 않고, 그 실패가 반복되지 않도록 lessons.md에 규칙으로 기록해 구조적으로 방지하는 방식을 만들었다.",
      },
      {
        title: "AI와 협업하는 방식에 대한 인식 변화",
        desc: "이전까지는 AI에게 단순히 구현을 지시하는 방식으로 사용했다면, 이번 프로젝트를 통해 그 방식의 한계를 직접 겪었다. 지금은 내가 전체 구조와 방향을 먼저 설계하고, AI는 그 안에서 정해진 역할을 수행하도록 조율하는 방식으로 접근하고 있다. 오케스트라의 지휘자처럼 각 역할과 흐름을 설계하고 조정하는 쪽이, AI를 훨씬 더 잘 활용하는 방식이라는 점을 체감한 프로젝트였다.",
      },
    ],
    links: [
      { label: "GitHub", url: "https://github.com/HSHyun/ktbot" }
    ],
    gallery: [
      "images/ktbot/1.png",
      "images/ktbot/2.png",
      "images/ktbot/3.png",
      "images/ktbot/4.png",
      "images/ktbot/5.png",
    ],
  }
  
,
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
    learned: [

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
    learned: [
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
