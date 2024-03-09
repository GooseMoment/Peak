from django_seed import Seed
import random
from datetime import date, datetime
from django.utils import timezone
from faker import Faker

from django.contrib.auth.hashers import (
    make_password,
)

fake = Faker("ko_KR")
seeder = Seed.seeder(locale="ko_KR")

def create():
    print("WARNING!")
    print("이 작업은 테스트용 임시 데이터를 만듭니다.")
    print("임시 데이터는 데이터 흉내만 낼뿐, 정합성은 맞지 않습니다.")
    print("!!!! 개발 또는 테스트 서버에서만 실행되어야 합니다. !!!")
    print("진행하려면 'create fake data'라고 입력하세요.")

    answer = input("> ")

    if answer != 'create fake data':
        print("작업 취소됨.")
        return
    
    __create()

def __create():

    try:
        from users.models import User
    except ModuleNotFoundError as e:
        print("@@@!!! python3 manage.py shell 안에서 import fake_data 하세요! !!!@@@")
        raise e

    """
    users_data = [
        {
            "username": "andless._.", "display_name": "구우구우",
            "password": "PASSWORD0", "email": "andys2004@example.com",
            "bio": "두 사람은 여관으로 돌아왔다."
        },
        {
            "username": "raccoon_nut_", "display_name": "🦝🌰",
            "password": "PASSWORD1", "email": "dksgo@example.com",
            "bio": "청년이 목욕을 하러 세면장으로 들어가자,"
        },
        {
            "username": "bmbwhl", "display_name": "범고래",
            "password": "PASSWORD2", "email": "bmbwhl@example.com",
            "bio": "나카타 상은 이불 속으로 들어가"
        },
        {
            "username": "minyeong2675", "display_name": "주민요이",
            "password": "PASSWORD3", "email": "minyoy@example.com",
            "bio": "이내 잠들어 버렸다."
        },
        {
            "username": "aksae", "display_name": "(주) 구스피",
            "password": "PASSWORD4", "email": "jinyoung3635@example.com",
            "bio": "청년은 텔레비전 야구 중계를"
        },
    ]

    users: list[User] = []

    for data in users_data:
        user = User.objects.create(
            username=data["username"], display_name=data["display_name"],
            password=data["password"], email=data["email"],
            bio=data["bio"]
        )

        users.append(user)
    """

    example_img_uris = [
        "https://avatars.githubusercontent.com/u/20675630?v=4",
        "https://avatars.githubusercontent.com/u/65756020?v=4",
        "https://avatars.githubusercontent.com/u/39623851?v=4",
        "https://avatars.githubusercontent.com/u/129763673?v=4",
    ]

    print("Add User...")
    seeder.add_entity(User, 10, {
        "username": lambda _: fake.user_name(),
        "display_name": lambda _: fake.name(),
        "profile_img_uri": lambda _: random.choice(example_img_uris),
        "followings_count": lambda _: random.randint(0, 100),
        "followers_count": lambda _: random.randint(0, 100),
        "password": make_password("PASSWORD_DEFAULT"),
        "is_staff": False,
        "is_superuser": False,
        "deleted_at": lambda _: None,
    })
        
    print("Add Project...")
    from projects.models import Project
    seeder.add_entity(Project, 20, {
        "color": lambda _: fake.color()[1:],
        "deleted_at": lambda _: random.choice([None, None, None, datetime.now(tz=timezone.utc)]),
    })

    print("Add Drawer...")
    from drawers.models import Drawer
    seeder.add_entity(Drawer, 30, {
        "deleted_at": lambda _: random.choice([None, None, None, datetime.now(tz=timezone.utc)]),
    })

    # TODO: match Task.drawer.user and Task.user 
    print("Add Task...")
    from tasks.models import Task
    seeder.add_entity(Task, 100, {
        "deleted_at": lambda _: random.choice([None, None, None, datetime.now(tz=timezone.utc)]),
    })

    print("Add DailyComment...")
    from social.models import DailyComment
    seeder.add_entity(DailyComment, 40, {
        "date": lambda _: date(2024, random.randint(2, 3), random.randint(1, 29)),
        "deleted_at": lambda _: random.choice([None, None, None, datetime.now(tz=timezone.utc)]),
    })

    # TODO: real img uris for emoji
    print("Add Emoji...")
    from social.models import Emoji
    seeder.add_entity(Emoji, 100, {
        "deleted_at": lambda _: None,
    })

    print("Add Reactions...")
    from social.models import Reaction
    seeder.add_entity(Reaction, 100, {
        "parent_type": lambda _: random.choice(Reaction.REACTION_TYPE)[0],
        "deleted_at": lambda _: random.choice([None, None, None, datetime.now(tz=timezone.utc)]),
    })

    print("Add Notification...")
    from notifications.models import Notification
    seeder.add_entity(Notification, 100, {
        "type": lambda _: random.choice(Notification.NOTIFICATION_TYPES)[0],
        "deleted_at": lambda _: random.choice([None, None, None, datetime.now(tz=timezone.utc)]),
    })

    inserted_pks = seeder.execute()
    print(f"DONE.")