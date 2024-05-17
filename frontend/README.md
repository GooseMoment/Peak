# frontend for Peak

## Structures

- `src/`
    - `main.jsx`: 소스코드 시작 부분
    - `utils/`: 유틸성 공용 함수
    - `components/`: 상황별 컴포넌트
    - `pages/`: 페이지


## PWA

[Vite PWA](https://vite-pwa-org.netlify.app/)을 이용해서 PWA화를 진행합니다.
`vite.config.js`에서 Vite PWA의 설정을 수정할 수 있습니다.
각종 아이콘은 [pwa-assets-generator](https://vite-pwa-org.netlify.app/assets-generator)로 제작합니다. 해당 설정은 `pwa-assets.config.js`에서 확인할 수 있습니다.

```bash
npm run generate-assets
```