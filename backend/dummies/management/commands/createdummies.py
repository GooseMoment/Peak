from django.core.management.base import BaseCommand, CommandError

from ._private import (
    create_users, create_projects, create_drawers, create_tasks,
    create_pecks, create_comments, create_daily_comments, create_emojis,
    create_reactions, create_followings, create_blocks, create_notifications,
)

from socket import gethostname
from sys import stdout

class Command(BaseCommand):
    help = "더미 데이터를 생성합니다"

    def add_arguments(self, parser):
        # see: https://docs.python.org/3/library/argparse.html#module-argparse
        parser.add_argument("--user", default=30, type=int, help="생성할 유저의 수를 지정합니다.")
        parser.add_argument("--emoji", default=50, type=int, help="불러올 에모지의 수를 지정합니다.")

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.NOTICE("이 작업은 테스트 서버/개발 서버에서만 실행되어야 합니다.")
        )
        self.stdout.write(
            self.style.NOTICE("테스트 서버 또는 개발 서버라면 아래의 호스트 네임을 똑같이 입력하세요.")
        )
        self.stdout.write(
           f"{gethostname()}: ", ending="",
        )
        answer = input()
        
        if answer != gethostname().strip():
            raise CommandError("Wrong hostname. aborted.")

        self.stdout.write(
            "더미 데이터 생성을 시작합니다."
        )

        self.stdout.write(
            "User를 생성합니다...", ending=" ",
        )
        stdout.flush()
        users = create_users(n=options["user"])
        self.stdout.write(
            self.style.SUCCESS(f"{len(users)}개 [OK]")
        )

        self.stdout.write(
            "Project를 생성합니다...", ending=" ",
        )
        stdout.flush()
        projects = create_projects(users)
        self.stdout.write(
            self.style.SUCCESS(f"{len(projects)}개 [OK]")
        )

        self.stdout.write(
            "Drawer를 생성합니다...", ending=" ",
        )
        stdout.flush()
        drawers = create_drawers(projects)
        self.stdout.write(
            self.style.SUCCESS(f"{len(drawers)}개 [OK]")
        )

        self.stdout.write(
            "Task를 생성합니다...", ending=" ",
        )
        stdout.flush()
        tasks = create_tasks(drawers)
        self.stdout.write(
            self.style.SUCCESS(f"{len(tasks)}개 [OK]")
        )

        self.stdout.write(
            "Peck을 생성합니다...", ending=" ",
        )
        stdout.flush()
        pecks = create_pecks(users, tasks)
        self.stdout.write(
            self.style.SUCCESS(f"{len(pecks)}개 [OK]")
        )

        self.stdout.write(
            "Comment를 생성합니다...", ending=" ",
        )
        stdout.flush()
        comments = create_comments(users, tasks)
        self.stdout.write(
            self.style.SUCCESS(f"{len(comments)}개 [OK]")
        )

        self.stdout.write(
            "DailyComment를 생성합니다...", ending=" ",
        )
        stdout.flush()
        daily_comments = create_daily_comments(users)
        self.stdout.write(
            self.style.SUCCESS(f"{len(daily_comments)}개 [OK]")
        )

        self.stdout.write(
            "Emoji를 인터넷에서 로드합니다...", ending=" ",
        )
        stdout.flush()
        emojis = create_emojis(limit=options["emoji"])
        self.stdout.write(
            self.style.SUCCESS(f"{len(emojis)}개 [OK]")
        )

        self.stdout.write(
            "Reaction을 생성합니다...", ending=" ",
        )
        stdout.flush()
        reactions = create_reactions(users, tasks, daily_comments, emojis)
        self.stdout.write(
            self.style.SUCCESS(f"{len(reactions)}개 [OK]")
        )

        self.stdout.write(
            "Following을 생성합니다...", ending=" ",
        )
        stdout.flush()
        followings = create_followings(users)
        self.stdout.write(
            self.style.SUCCESS(f"{len(followings)}개 [OK]")
        )

        self.stdout.write(
            "Block을 생성합니다...", ending=" ",
        )
        stdout.flush()
        blocks = create_blocks(users, followings)
        self.stdout.write(
            self.style.SUCCESS(f"{len(blocks)}개 [OK]")
        )

        self.stdout.write(
            "Notification을 생성합니다...", ending=" ",
        )
        stdout.flush()
        notifications = create_notifications(tasks, reactions, followings, pecks)
        self.stdout.write(
            self.style.SUCCESS(f"{len(notifications)}개 [OK]")
        )

        self.stdout.write(
            self.style.SUCCESS("모든 작업을 완료했습니다.")
        )