# Deploying Peak

## 엔트리포인트

Peak은 크게 두 가지 부분으로 나뉩니다. (한 서버에서 실행됩니다.)

- backend
    - 이미지 이름: api
    - 프로덕션 도메인: api.peak.ooo
    - 개발 도메인: localhost:8888
    - wsgi로 장고와 서버 프로그램과 연결
- frontend
    - 이미지 이름: web
    - 프로덕션 도메인: peak.ooo
    - 개발 도메인: localhost:8080
    - build해서 정적 파일로 제공

## 서버

서버 프로그램으로는 설정이 간편한 [Caddy](https://caddyserver.com/)를 사용합니다. 

- [Caddy vs Nginx: How Do These Web Servers / Reverse Proxies Compare?](https://www.reddit.com/r/selfhosted/comments/hur1hx/caddy_vs_nginx_how_do_these_web_servers_reverse/)
- [Features of Caddy](https://caddyserver.com/features)

WSGI 프로그램으로는 [gunicorn](https://gunicorn.org)을 사용합니다.

## 도커 컨테이너

도커 컨테이너는 이하와 같이 3개로 이뤄집니다.

- api: gunicorn (backend 디렉터리 포함)
- web: caddy
- db: postgresql
- redis: redis

## 실행

### 준비

```bash
docker volume create caddy_data
docker volume create db_data
```

오브젝트 스토리지에 접근하기 위해 `.env` 파일이 필요합니다. `.env.example`을 `.env`로 복사합시다.

```bash
cp .env.example .env
```

그 후 S3 등 필요한 부분을 변경해 주세요.

> Windows 환경에서 실행하는 경우, 앞으로의 명령어 중 `.sh` 파일 대신 `.ps1` 파일을 사용하십시오.

### 개발 환경일시

다른 터미널(또는 VSCode +버튼 눌러서 터미널 탭 추가)에서 `./frontend`에서

```bash
npm install -g pnpm@9 # install pnpm v9
pnpm i # install dependencies
pnpm dev # start dev server
```

```bash
# Peak 디렉터리에서 실행
docker compose build # 도커 이미지 빌드
docker compose create # 컨테이너 제작 (이미지 다운로드 진행)
docker compose run api python3 manage.py migrate # 마이그레이션 실행
docker compose start # 컨테이너 실행 (서비스 시작)

docker compose up # create & start
docker compose stop # 종료
docker compose down # 종료 및 컨테이너 내리기 
```

그 후, 프론트엔드는 [:8080](http://127.0.0.1:8080) 포트에서, 백엔드는 [:8888](http://127.0.0.1:8888) 포트에서 확인할 수 있습니다.

### 프로덕션일시

`frontend` 코드를 아래 명령어로 빌드합니다.

```bash
./deploy/run-builder.sh
```

(이후 `frontend`에 변경사항이 있으면 `docker compose` 실행할 필요없이 `run-builder.sh`만 실행해도 됩니다)

그 후, 아래와 같이 docker-compose를 실행합니다.

```bash
./deploy/compose-prod.sh build
./deploy/compose-prod.sh create
./deploy/compose-prod.sh run api python3 manage.py migrate
./deploy/compose-prod.sh start

# 종료 시
./deploy/compose-prod.sh stop
```

## Trouble Shooting

### permission denied: ./deploy/compose-prod.sh

스크립트에 실행 권한이 부족해서 발생하는 일입니다. 실행 권한을 부여해줍시다.

```bash
chmod +x ./deploy/compose-prod.sh
```

### role "peakuser" does not exist

```
django.db.utils.OperationalError: connection failed: FATAL:  password authentication failed for user "peakuser"
FATAL:  role "peakuser" does not exist
```

데이터베이스 볼륨 설정이 완료되지 않아 생긴 오류입니다. 볼륨과 컨테이너를 모두 내리고 다시 실행해주세요.

```bash
docker compose down -v
docker volume remove db_data

docker volume create db_data
docker compose up
```

### `Caddyfile(.prod)`를 변경했을 때

```bash
docker compose exec web caddy reload --config /etc/caddy/Caddyfile
```

를 입력하면 Caddyfile이 다시 로드 됩니다.
