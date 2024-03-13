# Deploying Peak

## 엔트리포인트

Peak은 내부적으로 세 가지 부분으로 나뉘어 있습니다.

- backend
- frontend
- landing

외부적으로는 두 가지 엔트리포인트를 갖습니다. (한 서버에서 실행됩니다)

- peak.ooo: frontend + landing
    - 각각 build해서 정적 파일로 제공
- api.peak.ooo: backend
    - wsgi로 장고와 서버 프로그램과 연결

## 서버

서버 프로그램으로는 설정이 간편한 [Caddy](https://caddyserver.com/)를 사용합니다. 

- [Caddy vs Nginx: How Do These Web Servers / Reverse Proxies Compare?](https://www.reddit.com/r/selfhosted/comments/hur1hx/caddy_vs_nginx_how_do_these_web_servers_reverse/)
- [Features of Caddy](https://caddyserver.com/features)

WSGI 프로그램으로는 [gunicorn](https://gunicorn.org)을 사용합니다.

## 도커 컨테이너

도커 컨테이너는 이하와 같이 3개로 이뤄집니다.

- api: gunicorn (backend 디렉터리 포함)
- web: caddy (frontend와 landing의 react 빌드 포함)
- db: postgresql

## 실행

```bash
# Peak 디렉터리에서 실행
docker-compose build # 도커 이미지 빌드
docker-compose create # 컨테이너 제작 (이미지 다운로드 진행)
docker-compose run api python3 manage.py migrate # 마이그레이션 실행
docker-compose start # 컨테이너 실행 (서비스 시작)
```