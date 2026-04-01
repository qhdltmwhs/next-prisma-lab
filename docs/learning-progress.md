# Next.js + Prisma 학습 진행 현황

## 학습자 배경
- Express.js 백엔드 경험 있음
- React, Next.js 초보
- Prisma 6 경험 있음 → Prisma 7 학습 중

---

## 완료된 학습

### Prisma 7 셋업
- `schema.prisma`: `provider = "prisma-client"` (v7 신규), `output` 필수
- `prisma.config.ts`: v7 신규 파일, CLI 설정 중앙화 (datasource URL, migrations, seed)
- `datasource`의 `url`이 schema가 아닌 `prisma.config.ts`에서 관리됨
- Driver Adapter 필수: `@prisma/adapter-pg` → `PrismaPg`
- Prisma Client import 경로: `@/app/generated/prisma/client`

### DB 셋업
- PostgreSQL 17 Docker로 실행 (`docker compose up -d`)
- `.env`: `DATABASE_URL=postgresql://prisma:prisma@localhost:5432/prismadb`
- 시드: 뉴진스 멤버 5명 (Minji, Hanni, Danielle, Haerin, Hyein)

### lib/prisma.ts — 싱글톤 패턴
- dev 핫리로드 시 PrismaClient 중복 생성 방지
- `globalThis`에 인스턴스 캐싱
- `PrismaPg` 어댑터 사용

### Next.js App Router 기초
- 파일 기반 라우팅: 폴더 = URL
- `[id]` = 동적 라우트 (Express의 `:id`)
- `page.tsx` = 해당 경로의 페이지
- 서버 컴포넌트가 기본 (async/await 바로 사용 가능)
- `"use client"` = 클라이언트 컴포넌트 선언

### 구현한 페이지
| 경로 | 파일 | 설명 |
|---|---|---|
| `/` | `app/page.tsx` | 멤버 목록 |
| `/members/new` | `app/members/new/page.tsx` | 멤버 추가 폼 |
| `/members/[id]` | `app/members/[id]/page.tsx` | 멤버 상세 |
| `/members/[id]/edit` | `app/members/[id]/edit/page.tsx` | 멤버 수정 폼 |

### Server Action
- `app/actions.ts`: `"use server"` 선언
- `createUser`, `updateUser`, `deleteUser` 구현
- `<form action={serverAction}>` 으로 연결
- `redirect()` 로 작업 후 페이지 이동
- `FormData`로 폼 데이터 수신 (Express의 `req.body` 역할)

### useState — 클라이언트 상태 관리
- `"use client"` 선언 필요 (useState는 클라이언트 컴포넌트에서만 사용 가능)
- `const [값, set함수] = useState(초기값)` 구조
- 배열 구조분해, `?.` 옵셔널 체이닝, `??` nullish coalescing
- 타자 칠 때마다 onChange → setState → 리렌더링 (실시간 유효성 검사 원리)
- `MemberForm.tsx`에 이름 필수 검사 적용: 빈칸이면 에러 메시지 + 버튼 비활성화
- 실무: 단순 폼은 useState 그대로, 검색창은 debounce, 복잡한 폼은 react-hook-form

### 컴포넌트 분리
- `app/members/_components/MemberForm.tsx`: 추가/수정 폼 공통 컴포넌트
- `_` 폴더: Next.js 라우트로 인식 안 됨
- `props`로 `user` 전달 여부에 따라 추가/수정 모드 전환

### 배운 개념
- `Link` 컴포넌트: Next.js 전용 `<a>` 태그
- `params: Promise<{ id: string }>`: Next.js 15+ 동적 라우트 파라미터
- 구조분해 + TypeScript 타입 표기
- `globalThis` / 이중 단언 (`as unknown as`)
- `@/` 경로 별칭: tsconfig paths 설정, Next.js 내장 지원
- `npx` vs 로컬 설치 차이
- `"type": "module"` 불필요한 이유 (Next.js 번들러가 처리)

---

### loading.tsx / error.tsx — Next.js 로딩/에러 처리
- `loading.tsx`: 해당 폴더 하위 페이지 데이터 로딩 중 자동 표시 (React Suspense 기반)
- `error.tsx`: 예상치 못한 에러 발생 시 자동 표시, 반드시 `"use client"` 필요
- 이 버전(Next.js 16)은 `reset` 대신 `unstable_retry` 사용 (예전 튜토리얼과 다름)
- 파일 위치가 적용 범위를 결정: `app/members/error.tsx` → members 하위에만 적용
- `throw new Error()`로 에러 발생 시 error.tsx가 자동으로 잡아줌

### useActionState — 서버 Action 에러를 클라이언트에 표시
- `useActionState(action, initialState)` → `[state, formAction, isPending]` 반환
- Action 첫 번째 인자로 `_prevState` 필수 (사용 안 해도 시그니처 맞춰야 함)
- 에러는 throw 대신 `return { error: "..." }` 으로 반환
- `isPending`: 제출 중 버튼 비활성화 + 텍스트 변경에 활용
- `try/catch`로 잡으면 서버 크래시 없이 정상 응답 처리 (Express의 res.status(400) 개념과 동일)
- `_` 접두사: 의도적으로 안 쓰는 변수 관례

## 다음 학습 예정
- Next.js App Router 로딩/에러 처리
- 파일 하나로 로딩 스피너, 에러 페이지 구성

---

## 현재 파일 구조
```
app/
├── actions.ts                        # Server Actions (CRUD)
├── page.tsx                          # 목록 페이지
├── generated/prisma/                 # Prisma Client (gitignored)
└── members/
    ├── _components/
    │   └── MemberForm.tsx            # 공통 폼 컴포넌트
    ├── new/
    │   └── page.tsx                  # 추가 페이지
    └── [id]/
        ├── page.tsx                  # 상세 페이지
        └── edit/
            └── page.tsx              # 수정 페이지
lib/
└── prisma.ts                         # Prisma 싱글톤
prisma/
├── schema.prisma                     # DB 스키마
├── seed.ts                           # 시드 스크립트
└── migrations/                       # 마이그레이션
prisma.config.ts                      # Prisma 7 설정
```
