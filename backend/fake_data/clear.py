import time

def __clear():
    from notifications.models import Notification
    Notification.objects.all().delete()

    from social.models import Reaction, Emoji, DailyComment
    Reaction.objects.all().delete()
    Emoji.objects.all().delete()
    DailyComment.objects.all().delete()

    from tasks.models import Task
    Task.objects.all().delete()

    from drawers.models import Drawer
    Drawer.objects.all().delete()

    from projects.models import Project
    Project.objects.all().delete()

    from users.models import User
    User.objects.all().delete()

    print("작업 완료됨.")

def clear():
    print("WARNING!!")
    time.sleep(2)
    print("이 작업은 데이터베이스의 모든 행을 삭제합니다.")
    time.sleep(3)
    print("개발 서버이거나, 테스트 서버에서만 진행하세요.\n현재 SSH로 접속했다면 더 주의하세요.")
    time.sleep(3)
    print("진행하려면 곧 나타나는 프롬프트에 'understood'라고 입력하세요.")
    time.sleep(3)
    answer = input("> ")

    if answer == "understood":
        __clear()
    else:
        print("작업이 취소되었습니다.")