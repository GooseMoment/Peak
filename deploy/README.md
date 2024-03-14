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

docker-compose up # create & start
docker-compose stop # 종료
docker-compose down # 종료 및 컨테이너 내리기 
```

## 실행 (프로덕션)

실행 전, `.env.prod` 파일이 필요합니다. `.env.prod.example`을 `.env.prod`로 복사합시다.

```bash
cp .env.prod.example .env.prod
```

`.env.prod`의 설정값을 적절히 교체합니다.
그 후, 아래와 같이 docker-compose를 실행합니다.

```bash
./deploy/compose-prod.sh build
./deploy/compose-prod.sh create
./deploy/compose-prod.sh run api python3 manage.py migrate
./deploy/compose-prod.sh start
./deploy/compose-prod.sh stop # 종료
```

## Trouble Shooting

### permission denied: ./deploy/compose-prod.sh

스크립트에 실행 권한이 부족해서 일어나는 일이다.

```bash
chmod +x ./deploy/compose-prod.sh
```

### role "peakuser" does not exist

```
django.db.utils.OperationalError: connection failed: FATAL:  password authentication failed for user "peakuser"
FATAL:  role "peakuser" does not exist
```

볼륨 설정이 제대로 되지 않은 것으로, 쿨하게 볼륨까지 내려주자(...) (다른 안전한 방법은 모르겠다)

```bash
docker-compose down -v
```