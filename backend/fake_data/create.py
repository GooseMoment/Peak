from django_seed import Seed
import random
from datetime import date
from faker import Faker

from django.contrib.auth.hashers import (
    make_password,
)

fake = Faker("ko_KR")
seeder = Seed.seeder(locale="ko_KR")

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
    "password": make_password("PASSWORD_DEFAULT"),
})
    
print("Add Project...")
from projects.models import Project
seeder.add_entity(Project, 20, {
    "color": lambda _: fake.color()[1:],
})

print("Add Drawer...")
from drawers.models import Drawer
seeder.add_entity(Drawer, 30)

# TODO: match Task.drawer.user and Task.user 
print("Add Task...")
from tasks.models import Task
seeder.add_entity(Task, 100)

print("Add DailyComment...")
from social.models import DailyComment
seeder.add_entity(DailyComment, 40, {
    "date": lambda _: date(2024, random.randint(2, 3), random.randint(1, 29)),
})

# TODO: real img uris for emoji
print("Add Emoji...")
from social.models import Emoji
seeder.add_entity(Emoji, 100)

print("Add Reactions...")
from social.models import Reaction
seeder.add_entity(Reaction, 100, {
    "parent_type": lambda _: random.choice(Reaction.REACTION_TYPE)[0],
})

print("Add Notification...")
from notifications.models import Notification
seeder.add_entity(Notification, 100, {
    "type": lambda _: random.choice(Notification.NOTIFICATION_TYPES)[0],
})

inserted_pks = seeder.execute()
print(f"{len(inserted_pks)} rows inserted. DONE.")