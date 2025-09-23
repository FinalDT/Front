1) 프로젝트 기본 설계 (P0)

 TS Strict On: tsconfig.json → "strict": true, "noUncheckedIndexedAccess": true, "exactOptionalPropertyTypes": true

 ESLint/Prettier 통합: @typescript-eslint/*, eslint-config-next, import/order 설정

 경로 별칭: baseUrl, paths 지정 (@/app, @/lib, @/components 등)

 환경변수 스키마화: zod로 env.ts 작성 → 서버/클라이언트 분리(NEXT_PUBLIC_만 클라이언트)

 커밋 훅: lint-staged + pre-commit에서 typecheck/lint 실행

2) App Router & 렌더링 모델 (P0)

 서버 컴포넌트 기본: 기본은 RSC(서버), 필요한 곳에만 "use client"

 폴더 설계: app/(routes)/page.tsx, 공통 UI는 app/(shared)/..., layout/segment로 중복 제거

 라우트 핸들러: app/api/**/route.ts 사용. DB 접근은 Node 런타임에서만

 스트리밍/Suspense: 느린 데이터 섹션은 loading.tsx + Suspense로 점진적 렌더링

 에러 표준화: error.tsx + 서버 로깅(Sentry 등) 연결

3) 데이터 패칭 & 캐싱 (P0)

 기본 정책: “가능하면 정적(SSG/ISR) → 필요 시 SSR → 최후에 CSR”

 revalidate 전략: fetch(url, { next:{ revalidate: N } })로 섹션별 TTL 관리

 태그 무효화: 변경 시 revalidateTag('posts')/revalidatePath('/dashboard')

 중복요청 방지: 동일 fetch는 Next가 자동 dedupe. 커스텀 클라 캐시는 최소화

 프리렌더링 경로: 트래픽 상위 경로는 generateStaticParams로 미리 생성

4) 로딩 속도 최적화 (Core Web Vitals) (P0)

 LCP 집중: 히어로 이미지 next/image + priority + 명시적 width/height

 폰트 최적화: next/font 사용(서브셋/자동 preload). 웹폰트 CDN 직접 로드는 지양

 JS 다이어트: 서버 컴포넌트 우선, 무거운 UI는 dynamic(()=>import(...), { ssr:false })

 이미지 최적화: sizes 정확히, placeholder="blur"는 LCP 영향 고려해 선택 적용

 프리패치 제어: <Link prefetch>는 중요 경로만. 과도한 prefetch 금지

 번들 분석: @next/bundle-analyzer로 TOP offenders 제거(아이콘 팩, 데이터 그리드 등)

 압축/전송: Brotli, HTTP/2(or 3) 활성화. CDN 캐시 정책(Cache-Control) 명확화

 CLS 방지: 모든 미디어/컴포넌트에 고정 사이즈/Aspect Ratio 지정

5) TypeScript 사용 원칙 (P0)

 도메인 스키마 = 타입: zod 스키마 → z.infer로 타입 생성(서버 검증 = 타입 진실원천)

 any 금지: unknown + 사용자 정의 type guard. never로 분기 누락 방지

 API 타입 안전: 요청/응답 DTO를 별도 모듈로 공유

 satisfies/const: 객체 리터럴에 satisfies와 as const로 안전한 좁히기

 비동기 안전: ESLint no-floating-promises로 누락된 await 방지

6) 상태관리 전략 (P1)

 로컬 UI 상태: useState/useReducer 우선

 서버 상태: 가능하면 서버 컴포넌트에서 패칭. CSR 필요 시 React Query 사용(staleTime 길게)

 글로벌 상태 최소화: 진짜 필요한 전역만 Zustand/Context로 처리

7) 스타일링 (P1)

 RSC 친화: CSS Modules/Tailwind 선호(런타임 CSS-in-JS 남용 금지)

 디자인 토큰화: CSS 변수로 컬러/스페이싱/타이포 일원화

 A11y 기본: 시맨틱 태그/Tab 순서/aria-* 점검 → Lighthouse/Axe로 검증

8) 백엔드 연동 & 데이터 계층 (P0)

 런타임 분리: DB/파일 I/O는 export const runtime = 'nodejs'

 커넥션 풀링: 서버리스 환경에서 Pool 제공 DB(Neon/PlanetScale/Managed PG) 또는 전용 드라이버

 Prisma 단일 인스턴스: globalThis.prisma ??= new PrismaClient()

 입출력 검증: API/서버 액션 입력은 zod.safeParse → 4xx/5xx 규격화

 서버 액션: 간단한 mutate는 Server Actions로 JS 비용 절감(권한 체크 필수)

9) 인증/보안 (P0)

 Auth.js(next-auth): 세션 전략(JWT/DB) 결정, 미들웨어로 보호 라우팅

 시크릿/키 관리: .env는 서버 전용. 클라엔 보내지 말 것

 CSP/보안 헤더: headers()/미들웨어로 CSP, X-Frame-Options, Referrer-Policy 설정

 XSS/주입 방지: dangerouslySetInnerHTML 금지(필요 시 sanitize)

 Rate Limit/Anti-abuse: API 별 제한(예: Upstash) + Bot 차단

10) 테스트 & 품질 (P1)

 유닛/컴포넌트: Vitest(or Jest) + React Testing Library

 E2E: Playwright로 핵심 유저 플로우(LCP/LCP 요소 존재) 검증

 타입 체킹 CI: tsc --noEmit + eslint + build 파이프라인 필수

11) 관측/모니터링 (P1)

 에러 트래킹: Sentry/Datadog 연결(서버/클라 각각 DSN)

 웹바이탈 수집: Next 내장 혹은 web-vitals로 LCP/CLS/INP 전송

 로그 표준화: 서버 로그 JSON 구조화(요청ID, 경로, latency, status)

12) 배포 & 인프라 (P1)

 에지/노드 선택: 라우트별 export const runtime 명시

 이미지 도메인 화이트리스트: next.config.js 이미지 도메인 설정

 CDN 캐싱 레이어: 정적 자산 immutable 캐시, API는 경로/태그 기반 무효화 전략

13) 안티패턴 (Do NOT)

 전역 "use client" 남발로 번들 폭증

 무분별한 CSR(초기 로딩 지연) / React Query 과사용

 LCP 이미지에 priority 누락 혹은 다중 priority로 경쟁 발생

 큰 아이콘/유틸 라이브러리 통째로 import(트리셰이킹 안됨)

 DB 호출을 에지 런타임에서 시도(드라이버 미지원/성능 문제)

 dangerouslySetInnerHTML에 원문 그대로 주입

“속도”만 따지면 이 10가지는 무조건 (초간단 P0)

서버 컴포넌트 기본, 클라 컴포 최소화

히어로 이미지 next/image + priority + 사이즈 고정

next/font로 폰트 최적화(서브셋/프리로드 자동)

상위 트래픽 경로 SSG/ISR로 프리렌더 + revalidate

느린 섹션 Suspense + 스트리밍

번들 분석해서 Top 3 무거운 의존성 제거/대체

아래-폴드 컴포넌트 dynamic(..., { ssr:false }) 지연 로드

CDN/Brotli/HTTP2 활성화 + 캐시 헤더 정확화

API 응답 축소(필드 셀렉션, pagination)

Lighthouse/Web Vitals 모니터링으로 회귀 방지