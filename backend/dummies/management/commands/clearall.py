from django.core.management.base import BaseCommand, CommandError

from socket import gethostname


class Command(BaseCommand):
    help = "데이터베이스의 데이터를 지웁니다."

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.ERROR("!!!!!!모든 데이터를 지우는 명령어입니다!!!!!!")
        )
        self.stdout.write(
            self.style.NOTICE(
                "이 작업은 테스트 서버/개발 서버에서만 실행되어야 합니다."
            )
        )
        self.stdout.write(
            self.style.NOTICE(
                "테스트 서버 또는 개발 서버라면 아래의 호스트 네임을 똑같이 입력하세요."
            )
        )
        self.stdout.write(
            f"{gethostname()}: ",
            ending="",
        )
        answer = input()

        if answer != gethostname().strip():
            raise CommandError("Wrong hostname. aborted.")

        self.stdout.write(
            self.style.NOTICE(
                "정말로 삭제를 진행하려면 '모두 삭제하겠습니다.'라고 입력하세요."
            )
        )

        answer = input("> ")
        if answer != "모두 삭제하겠습니다.":
            raise CommandError("Wrong answer. aborted.")

        self.stdout.write(self.style.NOTICE("삭제를 시작합니다."))

        from notifications.models import WebPushSubscription, Notification

        WebPushSubscription.objects.all().delete()
        Notification.objects.all().delete()

        from social.models import (
            Block,
            Following,
            Reaction,
            Emoji,
            DailyComment,
            Comment,
            Peck,
        )

        Block.objects.all().delete()
        Following.objects.all().delete()
        Reaction.objects.all().delete()
        Emoji.objects.all().delete()
        DailyComment.objects.all().delete()
        Comment.objects.all().delete()
        Peck.objects.all().delete()

        from tasks.models import Task

        Task.objects.all().delete()

        from drawers.models import Drawer

        Drawer.objects.all().delete()

        from projects.models import Project

        Project.objects.all().delete()

        from users.models import User

        User.objects.all().delete()

        self.stdout.write(self.style.SUCCESS("모두 삭제 완료."))
