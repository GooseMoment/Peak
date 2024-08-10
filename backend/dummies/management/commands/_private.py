from django.contrib.auth.hashers import make_password
from django.db.utils import IntegrityError
from django.core.management.base import CommandError

from users.models import User
from projects.models import Project
from drawers.models import Drawer
from tasks.models import Task
from social.models import (
    Peck, Comment, Quote, Emoji, Reaction, Following, Block
)

import random
from datetime import date, datetime, timedelta, timezone
import requests
from bs4 import BeautifulSoup, NavigableString
from faker import Faker
fake = Faker("ko_KR")

PASSWORD_DEFAULT = "PASSWORD_DEFAULT"

def factory_user() -> User:
    email = fake.email()
    return User(
        username=fake.user_name(),
        display_name=fake.name(),
        password=make_password(PASSWORD_DEFAULT),
        email=fake.email(),
        bio=fake.sentence(),
    )

def create_users(n: int = 30) -> list[User]:
    default_users_data = [
        {
            "username": "andless._.", "display_name": "구우구우",
            "password": PASSWORD_DEFAULT, "email": "andys2004@example.com",
            "bio": "두 사람은 여관으로 돌아왔다.",
        },
        {
            "username": "raccoon_nut_", "display_name": "🦝🌰",
            "password": PASSWORD_DEFAULT, "email": "dksgo@example.com",
            "bio": "청년이 목욕을 하러 세면장으로 들어가자,",
        },
        {
            "username": "bmbwhl", "display_name": "범고래",
            "password": PASSWORD_DEFAULT, "email": "bmbwhl@example.com",
            "bio": "나카타 상은 이불 속으로 들어가",
        },
        {
            "username": "minyeong2675", "display_name": "주민요이",
            "password": PASSWORD_DEFAULT, "email": "minyoy@example.com",
            "bio": "이내 잠들어 버렸다.",
        },
        {
            "username": "aksae", "display_name": "(주) 구스피",
            "password": PASSWORD_DEFAULT, "email": "jinyoung3635@example.com",
            "bio": "청년은 텔레비전 야구 중계를",
        },
    ]

    users: list[User] = []

    for data in default_users_data:
        try:
            user = User(
                username=data["username"], display_name=data["display_name"],
                password=make_password(data["password"]), email=data["email"],
                bio=data["bio"], 
            )

            user.save()
            users.append(user)
        except IntegrityError:
            # django.db.utils.IntegrityError: duplicate key value violates unique constraint "users_user_username_key"
            # DETAIL:  Key (username)=(andless._.) already exists.
            raise CommandError("clearall을 실행 후 다시 실행하세요.")

    for _ in range(n-len(default_users_data)):
        user = factory_user()
        user.save()
        users.append(user)
    
    return users

def factory_project(user: User, order: int) -> Project:
    return Project(
        name=fake.word(),
        user=user,
        order=order,
        color=f"{random.randint(0, 0xFFFFFF):06x}",
        type=random.choice(Project.PROJECT_TYPE_CHOICES)[0],
    )

def create_projects(users: list[User]) -> list[Project]:
    projects: list[Project] = []

    for user in users:
        n = random.randint(3, 15)
        for order in range(n):
            project = factory_project(user, order)
            project.save()
            projects.append(project)
    
    return projects

def factory_drawer(project: Project, order: int) -> Drawer:
    return Drawer(
        project=project,
        order=order,
        user=project.user,
        name=fake.word(),
        privacy=random.choice(Drawer.PRIVACY_TYPES)[0],
    )

def create_drawers(projects: list[Project]) -> list[Drawer]:
    drawers: list[Drawer] = []

    for project in projects:
        n = random.randint(1, 6)
        for order in range(n):
            drawer = factory_drawer(project, order)
            drawer.save()
            drawers.append(drawer)
    
    return drawers

def factory_task(drawer: Drawer) -> Task:
    start_date = datetime(2020, 1, 1, 0, 0, 0)
    end_date = datetime.now() - timedelta(days=30)
    # Doc: https://faker.readthedocs.io/en/master/providers/faker.providers.date_time.html#faker.providers.date_time.Provider.date_time_between_dates
    created_at = fake.date_time_between_dates(
        datetime_start=start_date, datetime_end=end_date, tzinfo=timezone.utc,
    )
    updated_at = created_at
    completed_at = None
    if random.randint(1, 3) == 1:
        completed_at = created_at + timedelta(days=random.randint(3, 30))
    
    deleted_at = None
    if random.randint(1, 5) == 1:
        deleted_at = created_at + timedelta(days=random.randint(1, 4))

    due_date = None
    due_time = None
    if random.randint(1, 4) == 1:
        due_date = created_at + timedelta(days=random.randint(0, 10))
        due_date = due_date.date()

        if random.randint(1, 2) == 1:
            due_time = fake.time_object()

    memo = None
    if random.randint(1, 4) == 1:
        memo = fake.paragraph()

    return Task(
        name=fake.sentence(),
        privacy=random.choice(Task.PRIVACY_TYPES)[0],
        created_at=created_at,
        updated_at=updated_at,
        deleted_at=deleted_at,
        completed_at=completed_at,
        drawer=drawer,
        due_date=due_date,
        due_time=due_time,
        priority=random.randint(0, 2),
        memo=memo,
        user=drawer.user,
    )

def create_tasks(drawers: list[Drawer]) -> list[Task]:
    tasks: list[Task] = []

    for drawer in drawers:
        n = random.randint(1, 30)
        for _ in range(n):
            task = factory_task(drawer)
            tasks.append(task)

            task.save()
            if task.completed_at:
                drawer.completed_task_count += 1
            else:
                drawer.uncompleted_task_count += 1

            drawer.save()
    
    return tasks

def factory_peck(user: User, task: Task) -> Peck:
    return Peck(
        user=user,
        task=task,
        count=random.randint(1, 100),
        created_at=task.created_at + timedelta(hours=random.randint(1, 24))
    )

def create_pecks(users: list[User], tasks: list[Task]) -> list[Peck]:
    pecks: list[Peck] = []

    for user in users:
        n = random.randint(0, len(tasks)//15)
        task_indexes = random.sample(range(len(tasks)), n)
        for task_index in task_indexes:
            peck = factory_peck(user, tasks[task_index])
            peck.save()
            pecks.append(peck)

    return pecks

def factory_comment(user: User, task: Task) -> Comment:
    return Comment(
        user=user,
        parent_type=Comment.FOR_TASK, # TODO: add a case for FOR_QUOTE
        task=task,
        comment=fake.sentence(),
        created_at=task.created_at + timedelta(hours=random.randint(1, 24))
    )

def create_comments(users: list[User], tasks: list[Task]) -> list[Comment]:
    comments: list[Comment] = []

    for user in users:
        n = random.randint(0, len(tasks)//15)
        task_indexes = random.sample(range(len(tasks)), n)
        for task_index in task_indexes:
            comment = factory_comment(user, tasks[task_index])
            comment.save()
            comments.append(comment)

    return comments

def factory_quote(user: User, date_at: date) -> Quote:
    return Quote(
        user=user,
        content=fake.sentence(),
        date=date_at,
        created_at=datetime.combine(date_at, fake.time_object()),
    )

def create_quotes(users: list[User]) -> list[Quote]:
    quotes: list[Quote] = []

    for user in users:
        date_ats: set[date] = set()
        n = random.randint(0, 30)

        for _ in range(n):
            start_date = date(2020, 1, 1)
            end_date = date.today() - timedelta(days=30)
            # Doc: https://faker.readthedocs.io/en/master/providers/faker.providers.date_time.html#faker.providers.date_time.Provider.date_time_between_dates
            date_at = fake.date_time_between_dates(
                datetime_start=start_date, datetime_end=end_date, tzinfo=timezone.utc,
            )
            date_ats.add(date_at)
        
        for date_at in date_ats:
            quote = factory_quote(user, date_at)
            quote.save()
            quotes.append(quote)

    return quotes

def factory_emoji(name: str, img_uri: str):
    return Emoji(
        name=name,
        img_uri=img_uri,
    )

def fetch_emojis_from_emojos(instance, limit=50, parser="lxml") -> dict[str, str]:
    res = requests.get("https://emojos.in/" + instance)
    if res.status_code != 200:
        print("Failed to fetch emojis:", res.status_code)
        return
    
    soup = BeautifulSoup(res.text, parser)
    parent = soup.select_one(".emojo")

    n = 0
    name_img_uris = dict()
    for div in parent.children:
        if n >= limit:
            break

        if isinstance(div, NavigableString): # ignore whitespaces
            continue

        img_uri = div.select_one("dt img").get("src")
        name = div.select_one("dd").getText()

        if len(name) > 2:
            name = name[1:-1] # remove wraping ":"s

        name_img_uris[name] = img_uri

        n += 1

    return name_img_uris

def create_emojis(limit=50) -> list[Emoji]:
    name_img_uris = fetch_emojis_from_emojos(limit=limit)
    emojis: list[Emoji] = []
    
    for name in name_img_uris:
        emoji = factory_emoji(name, name_img_uris[name])
        emoji.save()
        emojis.append(emoji)

    return emojis

def factory_reaction(user: User, parent_type: str, payload: Task | Quote, emoji: Emoji) -> Reaction:
    r = Reaction(
        user=user,
        emoji=emoji,
        parent_type=parent_type,
    )

    setattr(r, parent_type, payload)

    return r

def create_reactions(
        users: list[User], tasks: list[Task], quotes: list[Quote], emojis: list[Emoji]
    ) -> list[Reaction]:
    reactions: list[Reaction] = []
    
    for user in users:
        # reactions for tasks
        n = random.randint(0, len(tasks)//10)
        task_indexes = random.sample(range(len(tasks)), n)
        for task_index in task_indexes:
            reaction = factory_reaction(
                user, Reaction.FOR_TASK, tasks[task_index], random.choice(emojis),
            )
            reaction.save()
            reactions.append(reaction)
        
        # 이거 개노가다야
        # reactions for quotes
        n = random.randint(0, len(quotes)//5)
        quotes_indexes = random.sample(range(len(quotes)), n)
        for quote_index in quotes_indexes:
            reaction = factory_reaction(
                user, Reaction.FOR_quote, quotes[quote_index], random.choice(emojis),
            )
            reaction.save()
            reactions.append(reaction)

    return reactions

def factory_following(follower: User, followee: User) -> Following:
    start_date = date(2020, 1, 1)
    end_date = date.today() - timedelta(days=30)
    # Doc: https://faker.readthedocs.io/en/master/providers/faker.providers.date_time.html#faker.providers.date_time.Provider.date_time_between_dates
    created_at = fake.date_time_between_dates(
        datetime_start=start_date, datetime_end=end_date, tzinfo=timezone.utc,
    )
    updated_at = created_at
    status = random.choice(Following.STATUS_TYPE)[0]

    return Following(
        follower=follower,
        followee=followee,
        status=status,
        created_at=created_at,
        updated_at=updated_at,
    )

def create_followings(users: list[User]) -> dict[tuple[str, str], Following]:
    followings: dict[tuple[str, str], Following] = dict()

    for follower in users:
        for followee in users:
            if follower == followee:
                continue

            if random.random() > 0.5:
                continue

            following = factory_following(followee=followee, follower=follower)
            following.save()
            followings[(follower, followee)] = following

            if following.status == Following.ACCEPTED:
                follower.followings_count += 1
                followee.followers_count += 1
    
    for user in users:
        user.save()
    
    return followings

def factory_block(blocker: User, blockee: User) -> Block:
    start_date = date(2020, 1, 1)
    end_date = date.today() - timedelta(days=30)
    # Doc: https://faker.readthedocs.io/en/master/providers/faker.providers.date_time.html#faker.providers.date_time.Provider.date_time_between_dates
    created_at = fake.date_time_between_dates(
        datetime_start=start_date, datetime_end=end_date, tzinfo=timezone.utc,
    )
    return Block(
        blockee=blockee,
        blocker=blocker,
        created_at=created_at,
        updated_at=created_at,
    )

def create_blocks(users: list[User], followings: dict[tuple[str, str], Following]) -> list[Block]:
    blocks: list[Block] = []

    for blocker in users:
        for blockee in users:
            if blocker == blockee:
                continue

            if random.random() > 0.25:
                continue

            block = factory_block(blockee=blockee, blocker=blocker)
            block.save()
            blocks.append(block)
            
            try:
                del followings[(blockee, blocker)]
            except KeyError:
                pass
            
            try:
                del followings[(blocker, blockee)]
            except KeyError:
                pass
    
    return blocks
