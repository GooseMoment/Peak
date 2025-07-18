# Frontend for Peak

## Start

If you don't have pnpm, then check out the [pnpm installation guide](https://pnpm.io/installation).

```bash
pnpm i
pnpm dev
```

## Commands

- `pnpm dev`: start live dev server.
- `pnpm build`: build
- `pnpm lint`: Run ESLint
- `pnpm format:check`: Run prettier check
- `pnpm format:write`: Run prettier overwrite

## Structure

- `src/`
    - `api/`: API 콜백 함수
    - `assets/`: 소스 코드에서 참조해야 하는 데이터 및 미디어
    - `components/`: 페이지별 컴포넌트
    - `containers`: Layout
    - `pages/`: 페이지
    - `queries/`: react-query 관련
    - `utils/`: 유틸성 함수
    - `routers/`: 라우터 관련
    - `main.tsx`: 엔트리포인트

## PWA

[Vite PWA](https://vite-pwa-org.netlify.app/)을 이용해 Service Worker를 생성합니다.
`vite.config.ts`에서 Vite PWA의 설정을 수정할 수 있습니다.

앱 아이콘은 [pwa-assets-generator](https://vite-pwa-org.netlify.app/assets-generator)로 생성합니다. 해당 설정은 `pwa-assets.config.ts`에서 확인할 수 있습니다.

```bash
pnpm generate-assets
```
