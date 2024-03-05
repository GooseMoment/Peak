# Backend for Peak

## SQL 설정
psql이 존재하는지 확인:
```bash
psql --version
```

메타 DB에 접근:
```bash
# Linux
sudo -u postgres psql

# macOS
psql postgres

# Windows
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

## venv 초기화
```bash
python3 -m venv .venv
```

## venv 활성화
```bash
# macOS & Linux의 경우
source .venv/bin/activate

# Windows의 경우
Scripts\activate.bat
```

## 파이썬 패키지 설치
```bash
pip install -r requirements.txt
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