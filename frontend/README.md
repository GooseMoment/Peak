# Frontend for Peak

## Start

```bash
pnpm i
pnpm run dev
```

## Structure

- `src/`
    - `api/`: API 콜백 함수
    - `assets/`: 소스 코드에서 참조해야 하는 데이터 및 미디어
    - `components/`: 페이지별 컴포넌트
    - `containers`: Layout
    - `pages/`: 페이지
    - `queries/`: react-query 관련
    - `utils/`: 유틸성 함수
    - `main.jsx`: 소스코드 시작 부분
    - `router.jsx`: 메인 라우터
    - `hashRouter.jsx`: 해시 라우터 (현재 settings 관련만 존재)


## PWA

[Vite PWA](https://vite-pwa-org.netlify.app/)을 이용해서 PWA화를 진행합니다.
`vite.config.js`에서 Vite PWA의 설정을 수정할 수 있습니다.
각종 아이콘은 [pwa-assets-generator](https://vite-pwa-org.netlify.app/assets-generator)로 제작합니다. 해당 설정은 `pwa-assets.config.js`에서 확인할 수 있습니다.

```bash
npm run generate-assets
```
