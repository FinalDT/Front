0) 사고방식(메ンタ 모델)

 기본은 Server Component(RSC), 브라우저 상호작용이 필요할 때만 Client로 승격. 
Next.js
+1

 데이터는 서버에서 패치→직렬화된 props로 내려주기가 1순위. 클라 패칭은 예외적. 
Next.js

 캐시가 기본 동작임을 전제(Full Route Cache, Data Cache, Router Cache). 필요할 때만 무효화/미적용. 
Next.js
+1

1) Server vs Client 결정 체크리스트

 ❓DOM 이벤트/브라우저 API 필요? → Yes: "use client" 최상단에 추가. No: 서버 유지. 
Next.js

 ❓폼 처리/뮤테이션 중심? → 우선 서버 액션(권한 체크 포함). 클라에서만 가능한 효과가 있으면 client로 최소 범위만. 
Next.js

 ❓무거운 UI 라이브러리? → 가능하면 서버로 구성 + 지연 로드(dynamic import)로 하위 섹션만 client.

 ❓DB/비밀키 접근? → 항상 Node 런타임의 Server Component/Route Handler에서 실행.

2) 렌더링·캐싱 기본 규칙

 정적(SSG/ISR) 선호 → 동적(SSR) → CSR 순. 트래픽 상위 경로는 프리렌더. 
Next.js
+1

 서버 fetch는 캐시 정책을 코드로 명시:

변경 드문 데이터: 기본(또는 { cache: 'force-cache' })

항상 최신: { cache: 'no-store' } 또는 { next: { revalidate: 0 } }

주기 새로고침: { next: { revalidate: N } } (초 단위) 
Next.js
+1

 태그/경로 무효화: revalidateTag('foo'), revalidatePath('/route')로 갱신 트리거. 
Next.js

 Router Cache(클라이언트) 이해: 라우트 세그먼트 단위로 RSC payload를 보관·재사용. 네비게이션/프리패치 시 서버 요청을 줄임. 필요 시 router.refresh()로 현재 경로만 새로 고침. 
Next.js
+2
Next.js
+2

3) 리렌더링(서버/클라) 트리거 & 제어
A. Server Components가 다시 그려지는 경우

 해당 경로의 캐시 미스/만료/무효화(ISR 만료, revalidateTag/Path, router.refresh() 등). 
Next.js
+2
Next.js
+2

 동적 API 사용(예: cookies(), headers(), searchParams)으로 동적 렌더링으로 전환된 경우. 빌드 타임엔 DynamicServerError로 표식. 
Next.js

 fetch가 no-store/revalidate:0이면 요청마다 서버 렌더. 
Next.js

참고: 현재 태그 무효화는 경로 단위 재생성으로 동작하는 사례가 많습니다(라우트 전체 트리 재구성). 부분만 “갈아끼우는” 수준이 아닐 수 있음. 설계 시 경로 분할/경계 설정을 고려. (커뮤니티 관찰 근거) 
GitHub

B. Client Components가 다시 그려지는 경우

 props/상태/컨텍스트 변경 시. (리액트 규칙)

 라우팅/프리패치 시 Router Cache에 없거나 router.refresh() 호출 시 서버의 최신 RSC payload가 합쳐져 반영됨(브라우저 상태 유지). 
Next.js

 불필요 리렌더 방지: React.memo(입력 안정화), useMemo/useCallback은 하위 노드 뜨거운 경로에만 제한 사용. 전역 컨텍스트에 “자주 바뀌는 값” 넣지 않기.

4) 성능(웹 로딩/네비게이션 체감) 최적화 체크리스트

 LCP 최적화: 히어로 이미지는 next/image + 크기 명시 + 필요한 곳만 priority. 
Next.js

 스트리밍/Suspense: 느린 영역은 loading.tsx + Suspense로 점진적 렌더링. 
Next.js
+1

 Partial Prerendering(PPR): 정적+동적 혼합이 필요한 라우트에 검토(현재 실험적이므로 프로덕션 도입 시 안정성 평가). 
Next.js
+1

 요청 중복 제거: 동일 URL/옵션의 서버 fetch는 자동 request memoization. 중복 호출 신경 덜 써도 됨(옵션 동일 유지). 
Next.js

 JS 최소화: 가능한 한 서버 컴포넌트로 렌더하고, 상호작용 필요한 부분만 client로 지연 로드.

 Router Cache 전략: 리스트/디테일 등 재방문 많은 경로는 프리패치 기본값 활용, 변경 후엔 router.refresh()나 서버 액션으로 일관성 확보. 
Next.js
+1

5) 설계 방침(안정적 캐시·일관성)

 경로/세그먼트 분리: 무효화 영향 범위를 줄이려면 “자주 바뀌는 영역”을 별도 라우트/슬롯로 분해. (무효화=경로 단위 재생성 가능성) 
GitHub

 캐시 정책을 타입처럼 다룸: API마다 cache/revalidate를 명시하고, 태그 체계(posts, user:123)를 표준화. 
Next.js

 동적 사용 명확화: dynamic = 'force-dynamic'|'error' 등 Route Segment Config로 의도 선언. 빌드 타임 에러로 조기 검출. 
Next.js
+1

 클라 새로고침 규칙: 사용자 뮤테이션 후에는 서버 액션→router.refresh()(또는 대응 revalidatePath/Tag)의 표준 패턴을 팀 규칙으로. 
Next.js
+1

6) 안티패턴(피해야 할 것)

 페이지 전체를 "use client"로 지정하여 초기 JS를 폭증시키는 설계.

 모든 리스트/상세를 CSR + SWR/Query로만 처리(서버 렌더 이점 포기).

 무분별한 컨텍스트 공유로 사소한 변경에도 트리 전체 리렌더.

 캐시 무효화 없이 개인정보/사용자별 데이터 노출(라우터 캐시 특성 오해). 
Vercel

요약 “빨리 적용” 10가지

RSC 기본 + 필요한 곳만 "use client"

서버 fetch에 캐시/리밸리데이트를 코드로 명시

태그/경로 무효화 표준화(revalidateTag/Path)

Router Cache 이해하고 router.refresh() 사용처 명확화

스트리밍 + loading.tsx + Suspense로 초기 TTFB 개선

경로 분리로 무효화 영향 최소화

LCP 요소(히어로 이미지/폰트) 최적화

동적 함수 사용 시 dynamic 전환을 의도적으로 제어

클라 리렌더는 **입력 안정화(메모이제이션/분리)**로 국소화

상위 트래픽 경로는 SSG/ISR로 선점