# Backend for Peak

## SQL 설정
psql이 존재하는지 확인:
```bash
psql --version
```

메타 DB에 접근:
```bash
# for linux
sudo -u postgres psql
# for macos
psql postgres
# for windows 
psql -U postgres
```

데이터베이스 생성:
```sql
create database peakdb;
```

유저 생성:
- 로컬 개발 시 암호는 동일하게 (`settings.py`에 언급된 대로)
```sql
create user peakuser with encrypted password 'PEAK_DEFAULT_PASSWORD';
```

생성한 유저에게 생성한 데이터베이스 권한 부여:
```sql
grant all privileges on database peakdb to peakuser;
```

## 패키지 설치
PostgreSQL 사용에 필요한 패키지:
```bash
pip3 install psycopg
```

## 서버 실행

DB에 스키마 추가:
```bash
python3 manage.py migrate
```

서버 실행:
```bash
python3 manage.py runserver
```