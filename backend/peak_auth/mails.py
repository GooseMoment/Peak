from django.conf import settings
from django.core.mail import EmailMultiAlternatives

from rest_framework.request import Request

from users.models import User
from . import exceptions
from .models import EmailVerificationToken
from .locale import get_translations

from datetime import datetime, UTC
from socket import gaierror


def get_first_language(request: Request):
    languages = request.headers.get("Accept-Language", "").split(",")
    return languages[0]


class Email(EmailMultiAlternatives):
    def send(self, fail_silently: bool = False) -> int:
        try:
            return super().send(fail_silently)
        except gaierror:
            print("[ERROR] Unable to send email. Check out DJANGO_EMAIL_HOST in .env.")
            raise exceptions.EmailNotSent


def send_mail_verification_email(user: User, verification: EmailVerificationToken):
    t = get_translations(verification.locale)["mail_verification_email"]

    link = verification.link

    subject = t["subject"]

    text_content = t["text_content"].format(
        username=user.username,
        link=link,
    )

    email = Email(
        subject=subject,
        body=text_content,
        from_email=None,
        to=(user.email,),
    )

    email.send()

    verification.last_sent_at = datetime.now(UTC)
    verification.save()


def send_mail_already_verified(user: User, locale: str):
    t = get_translations(locale)["mail_already_verified"]

    link = f"{settings.SCHEME}{settings.WEB_HOSTNAME}/sign/in"

    subject = t["subject"]

    text_content = t["text_content"].format(
        username=user.username,
        link=link,
    )

    email = Email(
        subject=subject,
        body=text_content,
        from_email=None,
        to=(user.email,),
    )

    email.send()


def send_mail_no_account(address: str, locale: str):
    t = get_translations(locale)["mail_no_account"]

    link = f"{settings.SCHEME}{settings.WEB_HOSTNAME}/sign/up"

    subject = t["subject"]

    text_content = t["text_content"].format(
        email=address,
        link=link,
    )

    Email(
        subject=subject,
        body=text_content,
        from_email=None,
        to=(address,),
    ).send()


def send_mail_password_recovery(user: User, link: str, locale: str):
    t = get_translations(locale)["mail_password_recovery"]

    subject = t["subject"]

    text_content = t["text_content"].format(
        username=user.username,
        link=link,
    )

    email = Email(
        subject=subject,
        body=text_content,
        from_email=None,
        to=(user.email,),
    )

    email.send()


def send_mail_already_registered(user: User, locale: str):
    t = get_translations(locale)["mail_already_registered"]

    subject = t["subject"]

    link = f"{settings.SCHEME}{settings.WEB_HOSTNAME}/sign/in"

    text_content = t["text_content"].format(
        email=user.email,
        link=link,
    )

    email = Email(
        subject=subject,
        body=text_content,
        from_email=None,
        to=(user.email,),
    )

    email.send()
