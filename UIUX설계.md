# Neo‑Brutalism MVP UI/UX Design Specification – Tutor Flow (No‑Data Prototype)

> **Scope**: 프론트 중심 MVP. 실제 데이터 없이 **즉시 클릭·시나리오 데모**가 가능한 UI를 설계합니다. 로그인은 가짜(원클릭). 백엔드/DB는 **모킹 응답**만 가정.
> **Style**: 네오브루탈리즘 — 두꺼운 외곽선(3–4px), 강한 대비, 플랫 면, 의도된 투박함, 하드 섀도(블러 최소).
> **Stack 가정**: Next.js + TypeScript + TailwindCSS.

---

## A. 제품 요약
- **목표**: 학습자(가짜 로그인)를 기준으로 최근 6문항 컨텍스트를 LLM에 전달하고, **개인화 피드백 대화 UI**를 시뮬레이션한다.
- **핵심 플로우**: 로그인 → 개인화 컨텍스트(목업) 호출 → LLM 튜터 응답(목업 스트리밍) → 반복.
- **비포함**: 실제 회원 DB, 실제 정답/정오답 로직, 보안/권한, 실데이터 정합성.

---

## B. 정보 구조 & 내비게이션
- **최상위 IA (게스트 사전평가 포함)**
  - `/` 랜딩 **(풀블리드 히어로 + 학년 선택 + CTA)**
  - `/try` **사전평가 시작**(학년만 입력)
  - `/quiz` **사전평가 세션**(문항 5개 목업)
  - `/results-teaser` **결과 티저**(레벨 요약 잠금 + 회원가입 유도)
  - `/auth` 원클릭 로그인/회원가입(가짜)
  - `/dashboard` 홈(요약)
  - `/context` 개인화 컨텍스트(최근 6문항 프리뷰)
  - `/tutor` LLM 튜터 대화
  - `/settings` 프로필/환경설정(가짜)
  - 시스템: `/loading`, `/error`, `404/500`

- **내비게이션 패턴**
  - **Desktop**: 상단 헤더 + 좌측 사이드바(아이콘+라벨). 현재 경로 4px 언더라인.
  - **Tablet(주 타깃)**: 상단 헤더 고정, **풀블리드 히어로**는 안전영역 가이던스만(내부 패딩 최소화), 사전평가 CTA 고정.
  - **Mobile**: 상단 헤더(햄버거) + 하단 탭바(홈/컨텍스트/튜터/설정).

---

## C. 페이지별 스펙 (Adaptive Wireframes 포함)

### 1) 랜딩 `/`
**목적**: 서비스 톤 제시 + **즉시 사전평가(회원가입 전)** 시작 유도.

**히어로(풀블리드, 태블릿 최적화)**
- **높이**: `min-height: 90vh` (태블릿에서 **상단/좌우 여백 없음**)
- **구성**: 좌측 텍스트 스택(타이틀/설명/그레이드 선택/CTA) + 우측 일러스트(네오브루탈리즘 스티커/하드섀도)
- **타이포**: H1 72/80 (태블릿 64/72), Sub 18/28
- **컬러**: 모노톤 배경 + **액센트(#FF90E8)** 버튼/언더라인
- **그레이드 선택**: **세그먼트 라디오**(중1/중2/중3 등) — `role="radiogroup" aria-labelledby="grade-label"`
- **CTA**: Primary “내 수준 파악해보기” → `/try?grade={선택값}`
- **Secondary**: Outline “둘러보기” → 랜딩 하단 섹션 앵커

**Desktop 레이아웃(12-col)**
```
[Header 80px ── bottom border 3px]

┌──────────────────────────────────────────────────────────┐
│ H1: “정직한 튜터, 지금 내 수준 확인”                   │
│ Sub: 한 문장 소개                                        │
│ [중1][중2][중3]  (세그먼트 라디오, 3px 보더)             │
│ [내 수준 파악해보기]  [둘러보기]                          │
│ (우측) 스티커/콜라주 일러 + 하드 섀도                     │
└──────────────────────────────────────────────────────────┘
```
**Tablet**: 동일 풀블리드, 텍스트·컨트롤은 **좌하단 고정 스택**(엄지 도달성 ↑), CTA는 48–56px 높이.
**Mobile**: 단일 컬럼, CTA 풀너비.

**히어로 외 섹션**: Key Points, Fake Metrics, Testimonials(말풍선 카드 3px), 모두 **섹션 간 0 외곽 여백**(히어로와 자연 연결).
**ARIA**: `<header role="banner">`, 세그먼트 `role="radiogroup"`, 각 옵션 `role="radio" aria-checked`.

---

#### 1.5) 사전평가 시작 `/try`
**목적**: **학년만 입력받아** 빠르게 평가 시작(회원가입 불필요).

**UI**
- 카드(보더 3px): 학년 세그먼트(중1/중2/중3) + 시작 버튼
- 시작 시 `localStorage.guestSessionId` 생성 → `/quiz`로 라우팅
- 보조 링크: “나중에 가입할게요(게스트로 계속)”

**상태**: 로딩(스피너 800ms), 실패(토스트)
**ARIA**: 카드 `role="region" aria-labelledby="try-title"`

---

#### 1.6) 사전평가 세션 `/quiz`
**목적**: 목업 문항 **5개** 진행 → 결과 티저로 연결.

**UI**
- 상단 진행 바(3px 보더), **문항 카드**(보더 3px + 하드 섀도)
- 선택지: 라디오 리스트(44px 이상 터치 타깃), “모르겠어요” 버튼
- 푸터: [이전][다음/제출]

**인터랙션**
- 5/5 완료 시 `/results-teaser?grade=…`로 이동
- 중도 이탈 시 확인 모달

**ARIA**: 문항 컨테이너 `role="group" aria-labelledby="q-title"`, 진행바 `aria-valuenow` 등

---

#### 1.7) 결과 티저(가입 유도) `/results-teaser`
**목적**: 핵심 지표를 **블러/마스킹**하여 노출 → 회원가입 CTA 유도.

**UI**
- 레벨 카드(예: “예상 레벨: A–C”) **블러 처리**
- 태그 정확도 스파크바(가짜 값) **50%만 표시** + 나머지 잠금 아이콘
- CTA Primary: “회원가입하고 전체 결과 보기” → `/auth` (가입 후 `/dashboard`에서 전체 결과 언락)
- 서브 CTA: “게스트로 다시 풀기” → `/quiz` 재시작

**카피**
- “계정을 만들면 오늘 결과와 향후 추천 학습을 저장해 드려요.”

**접근성**
- 잠금 요소는 `aria-hidden="true"` + 시각적 안내 텍스트 제공(`sr-only`)

---

### 2) 가짜 로그인 `/auth`
**목적**: 폼 없이 원클릭 로그인.

**UI**
- 카드(보더 3px) 안에 설명 + 버튼 하나: **“한 번 눌러 로그인”**
- 클릭 시 800ms 로딩 모달(스피너) → `/dashboard`로 라우팅.

**상태**: 로딩/성공/실패(토스트). 실패는 10% 확률 목업(재시도 버튼 포함).
**ARIA**: 로딩 모달 `role="dialog"` + `aria-busy="true"`; 토스트 `role="status"`.

---

### 3) 대시보드 `/dashboard`
**목적**: 컨텍스트/튜터로 이어지는 허브.

**모듈**:
- 상단 요약 스트립(“최근 학습 스냅샷” 가짜 지표)
- 2열 카드: **Personal Context 프리뷰**, **튜터로 이동** 카드
- 최근 활동 로그(가짜 3개)

**Desktop(12-col)**
```
[Header]
[Summary strip ── full width, 3px border]
[Card: Context Preview] [Card: Go to Tutor]
[Recent Activity list (bordered list)]
```
**Mobile**: 단일 컬럼 스택.

**상태**:
- Empty: “아직 기록 없음 — 튜터에서 첫 대화를 시작해 보세요.”
- Loading: 스켈레톤(회색 면, 보더 유지)
- Error: Retry 버튼.

**ARIA**: 리스트는 `<ul role="list">` 항목 `<li>`.

---

### 4) 개인화 컨텍스트 `/context`
**목적**: LLM 프롬프트에 주입할 **최근 6문항 JSON**(목업) 시각화.

**모듈**:
- 컨텍스트 카드(보더3px): 문항 6개 타일(개념태그, 정오답 아이콘)
- “LLM에 이 컨텍스트 전달” 버튼(→ `/tutor` 이동, 쿼리스트링으로 목업 JSON 전달)
- JSON 뷰 토글(프리티/압축)

**Desktop**
```
[Header]
[Context Tiles x6  (3x2 grid, each 3px border)]
[JSON Viewer (collapsible)]   [Send to Tutor CTA]
```
**Mobile**: 2x3 그리드 → JSON 뷰는 아코디언.

**상태**: Empty/Loading/Error 동일 패턴.
**ARIA**: JSON 뷰어는 `<section aria-label="컨텍스트 JSON">` + copy 버튼 `aria-label` 제공.

---

### 5) 튜터 대화 `/tutor`
**목적**: 컨텍스트 주입 기반 LLM 응답(가짜 스트리밍) 시뮬레이션.

**모듈**:
- 메시지 영역: 좌(튜터), 우(사용자) 말풍선 (3px 테두리, 하드 섀도)
- 입력창: 프롬프트, 전송 버튼
- 상단 바: 현재 컨텍스트 요약 배지(토글로 자세히)
- 사이드 패널(Desktop): “추천 액션” 카드(다음 문제 풀기 등 목업)

**Desktop**
```
[Header]
[Left: Chat stream (flex-1)]  [Right: Actions/Context (320px)]
[Composer bar: input + send]
```
**Mobile**: 상단 컨텍스트 배지 → 채팅 → 입력창, 사이드 패널은 **오버레이 시트**로.

**인터랙션**:
- 전송 시: 200–400ms 후 **타자 효과**로 스트리밍(가짜)
- 실패 시: 말풍선 내 재시도 버튼/복사 버튼
- 메시지 퀵액션: 복사/책갈피/신고(가짜)

**상태**: Empty(“안녕하세요! 컨텍스트 기반으로 도와드릴게요.”), Loading(스트림), Error 토스트.
**ARIA**: 메시지 영역 `role="log" aria-live="polite"`; 입력창 `aria-label="메시지 입력"`.

---

### 6) 설정 `/settings`
**목적**: 닉네임/학년(grade) 등 가짜 편집.

**UI**: 필드 3–4개, 저장 버튼(저장 시 토스트), “로그아웃(가짜)” 버튼.
**ARIA**: 폼 `aria-describedby`(도움말), 에러 `role="alert"`.

---

### 시스템 페이지 & 공통 상태
- **/loading**: 전면 로더 + 설명 카피.
- **/error**: 에러 카드 + 리트라이.
- **404/500**: 큰 타이포 + 홈으로.
- **스켈레톤 원칙**: 실 카드 구조와 동일(보더 유지), 면 채움.

---

## D. 네오브루탈리즘 디자인 토큰
- **Colors**
  - `--bg: #F7F7F5` (라이트) / `#111111` (다크)
  - `--ink: #111111` / `#F5F5F5`
  - `--accent: #FF90E8` (예시) 1개만 강하게
  - `--border: currentColor` (보더 3–4px)
- **Radii**: 0, 8, 12 (버튼/배지만 라운드)
- **Shadow (Hard)**: `0 6px 0 rgba(0,0,0,1)` (다크에선 밝은색으로 반전)
- **Spacing scale**: 4, 8, 12, 16, 24, 32, 48, 64
- **Motion**: 150ms ease-out(hover), 120ms press-in(active)

---

## E. 타이포그래피 (모던 산세리프)
- 폰트: Inter / Sora / Space Grotesk
- **Desktop**
  - H1: 64/72, H2: 48/56, H3: 32/40, Body: 16/24, Caption: 12/16 (px/line-height)
- **Mobile**
  - H1: 40/48, H2: 28/36, H3: 22/30, Body: 15/22, Caption: 12/16
- 타이틀 굵기 700–800, 본문 400–500, 타이틀 자간 -1%.

**컴포넌트별 크기 매핑**
- 헤더 타이틀(H3), 카드 타이틀(H4≈20/28), 버튼 라벨(14/20), 폼 라벨(12/16), 탭(14/20).

---

## F. 컴포넌트 세트 (상태/인터랙션 포함)

### Buttons
- **Primary (Filled)**: 면 채움 + 3px 보더, 라운드 12, 높이 L(48)/M(40)/S(32)
- **Outline**: 투명 배경 + 3px 보더, 동일 사이징
- **States**: hover(보더 3→4px, translateY(-2px)), active(translateY(+1px)), disabled(투명도 60%)
- **ARIA**: `aria-pressed`(토글형), `aria-busy`(로딩형)

### Inputs
- 텍스트/비번/셀렉트 모두 3px 보더, 내부 패딩 12–16
- 에러: 보더 색 전환 + 도움말(`role="alert"`)
- 포커스: 3px 아웃라인(점선/솔리드)

### Cards
- 3px 보더 + 하드 섀도, 패딩 24–32, 헤더/본문/푸터

### Tabs & Sidebar
- 탭 높이 44–52, 활성 4px 언더라인
- 사이드바 아이템: 아이콘 24 + 라벨 14/20, 활성시 배경 면 채움

### Badges/Chips
- 두꺼운 외곽선 + 평면 채움, 라운드 8

### Toast/Modal
- 토스트: 좌하/우하, `role="status"`
- 모달: `role="dialog"` + `aria-modal="true"` + 포커스 트랩

### Chat Bubbles
- 3px 보더, 좌(튜터)/우(유저) 정렬, 말꼬리 각짐
- 메시지 액션: 복사, 북마크, 신고(가짜)
- 스트리밍: 도트 점멸 애니메이션(모션 감도 옵션 반영)

### JSON Viewer
- 모노스페이스, 줄번호 토글, 복사 버튼

---

## G. 접근성 가이드 (필수)
- **대비**: 본문/아이콘 AA 4.5:1+, 헤딩 3:1+
- **키보드**: 탭 순서 논리, 포커스 인디케이터 3px 유지
- **라이브 리전**: 채팅 `role="log" aria-live="polite"`(중복 낭독 방지)
- **폼**: 라벨-컨트롤 연결(`for`/`id`), 에러 텍스트와 입력의 `aria-describedby` 연결
- **모션**: `prefers-reduced-motion`시 애니메이션 제거/단축
- **터치 타겟**: 44×44px 이상

---

## H. AI 통합 블루프린트 (모킹 전제)
```yaml
app:
  pages:
    - path: "/"
      id: landing
      hero:
        gradePicker: segmented-radio # 중1/중2/중3
      ctaPrimary: {label: "내 수준 파악해보기", action: "route:/try"}
      ctaSecondary: {label: "둘러보기", action: "scroll:#features"}

    - path: "/try"
      id: try
      actions:
        startGuest:
          effect:
            - setLocalStorage({ guestSessionId: "uuid()", grade: "selected" })
          then: route("/quiz")

    - path: "/quiz"
      id: quiz
      data: mock.quiz.items5 # static items
      state:
        progress: 0..5
      onSubmit:
        effect:
          - setLocalStorage({ lastQuiz: "answers" })
        then: route("/results-teaser")

    - path: "/results-teaser"
      id: resultsTeaser
      data: mock.results.teaser # blurred/locked metrics
      ctaPrimary: {label: "회원가입하고 전체 결과 보기", action: "route:/auth"}
      ctaSecondary: {label: "게스트로 다시 풀기", action: "route:/quiz"}

    - path: "/auth"
      id: auth
      actions:
        fakeSignupLogin:
          effect:
            - setSession({ auth_user_id: "demo-uid" })
            - migrateLocalStorageToSession({ from: "guestSessionId,lastQuiz" })
          then: route("/dashboard")

    - path: "/dashboard"
      id: dashboard
      widgets: [summaryStrip, contextPreviewCard, goTutorCard, recentActivity]

    - path: "/context"
      id: context
      data: mock.personalContext.latest6
      actions:
        sendToTutor: route("/tutor?ctx=latest6")

    - path: "/tutor"
      id: tutor
      data:
        contextSource: query.ctx or mock.personalContext.latest6
      llm:
        promptTemplate: tutorPromptV1
        mode: streamFake
```

**`tutorPromptV1` (슬롯형)**
```
SYSTEM: 너는 친절하고 간결한 수학 튜터야. 톤은 정직하고 직설적.
CONTEXT(JSON): {{personal_context_json}}
USER: {{user_input}}
INSTRUCTION: 최대 5문장, 개념→예시→다음 액션 순으로.
```

---

## I. 반응형 규칙 (Desktop ↔ Mobile)
- 컨테이너 패딩: Desktop 96px / Mobile 20–24px
- 그리드: Desktop 12-col(80–120 gutter), Mobile 4-col
- 사이드바: ≥1024px에서 고정, 그 미만은 숨김 + 탭바 노출
- 카드 그리드: 3열→2열(≥768)→1열(≤480)

---

## J. 구현 핸드오프 (Tailwind 프리셋 예시)
```ts
// tokens.ts (예)
export const tokens = {
  colors: {
    bg: '#F7F7F5', ink: '#111111', accent: '#FF90E8'
  },
  border: '3px', radius: { none: '0', sm: '8px', md: '12px' },
  shadowHard: '0 6px 0 rgba(0,0,0,1)'
};
```
```html
<button class="h-12 px-6 border-ink border-[3px] rounded-[12px] shadow-[0_6px_0_rgba(0,0,0,1)] bg-[var(--accent)] text-ink hover:-translate-y-0.5 active:translate-y-0.5 transition">
  시작하기
</button>
```

---

## K. 품질 기준 (MVP DoD)
- [ ] 모든 페이지는 **Empty/Loading/Error** 상태를 가진다.
- [ ] `/auth`에서 1클릭 로그인 → `/dashboard` 1초 이내 렌더.
- [ ] `/context`에서 **타일 6개**와 **JSON 뷰**가 토글된다.
- [ ] `/tutor`에서 입력→가짜 스트리밍 응답이 2초 내 표시.
- [ ] 키보드만으로 전 플로우를 완주할 수 있다(포커스 표시 유지).
- [ ] 본문 대비 AA 충족, 헤딩 3:1+.

---

## L. 의사결정 근거 & 확장성
- **네오브루탈리즘**의 강한 보더/하드 섀도는 정보 블록을 신속히 인지시키며, 프로토타입 임팩트를 극대화.
- **모노톤 + 1액센트**로 접근성과 브랜드 임팩트 균형 유지.
- **Empty/Loading/Error**를 먼저 설계하여 실데이터 도입 전에 **UX 안정성** 확보.
- **AI 블루프린트(YAML)**로 모델 교체/실데이터 연결 시에도 프런트 수정 최소화.

---

## M. 빠른 시작 체크리스트
1) 페이지 라우트 생성(Next.js App Router)  
2) 공통 레이아웃: 헤더/사이드바/탭바  
3) 토큰/프리셋 적용(Tailwind config)  
4) 공통 상태 컴포넌트: 스켈레톤·토스트·모달  
5) 가짜 API(msw 또는 하드코딩 JSON)  
6) 튜터 스트림 타이핑 이펙트 구현  
7) 접근성 점검(키보드·대비·ARIA)

