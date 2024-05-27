# Backend for Peak

## Apps

- `django_peak`: 프로젝트 설정이 담긴 `settings.py`와 가장 높은 단계의 URL 패턴을 포함하는 `urls.py`가 있습니다.
- `api`: 여러 앱에서 사용하는 모델(`Base`)과 권한(`permissions.py`) 등이 있습니다. 
- `dummies`: `createdummies`와 `clearall` Command가 있습니다.

- `users`: `User` 모델과 뷰
- `user_setting`: `UserSetting` 모델과 뷰

- `tasks`: `Task` 모델과 뷰
- `drawers`: `Drawer` 모델과 뷰
- `projects`: `Project` 모델과 뷰

- `search`: 검색에 관한 모델과 뷰 (예정)
- `today`: '오늘' 기능에 관한 모델과 뷰 (미사용)
- `social`: `Emoji`, `Peck`, `DailyComment`, `Reaction`, `Comment`, `Following` & `Block` 모델과 뷰
- `notifications`: `Notification` & `TaskReminder` 모델과 뷰

## Docker 미사용 시

### SQL 설정
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

### venv 초기화
```bash
python3 -m venv .venv
```

### venv 활성화
```bash
# macOS & Linux의 경우
source .venv/bin/activate

# Windows의 경우
Scripts\activate.bat
```

### 파이썬 패키지 설치
```bash
pip install -r requirements.txt
```

### 서버 실행

DB에 스키마 추가:
```bash
python3 manage.py migrate
```

서버 실행:
```bash
python3 manage.py runserver
```
