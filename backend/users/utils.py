from django.conf import settings
from django.core.mail import EmailMultiAlternatives

from rest_framework.request import Request

from .models import User, EmailVerificationToken
from .locale import get_translations

from datetime import datetime, UTC

def get_first_language(request: Request):
    languages = request.headers.get("Accept-Language", "").split(",")
    return languages[0]

def send_mail_verification_email(user: User, verification: EmailVerificationToken):
    t = get_translations(verification.locale)["mail_verification_email"]

    link = verification.link

    subject = t["subject"]

    text_content = t["text_content"].format(
        username=user.username,
        link=link,
    )

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=None,
        to=(user.email, ),
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
    
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=None,
        to=(user.email, ),
    )

    email.send()

def send_mail_no_account(email: str, locale: str):
    t = get_translations(locale)["mail_no_account"]

    link = f"{settings.SCHEME}{settings.WEB_HOSTNAME}/sign/up"

    subject = t["subject"]

    text_content = t["text_content"].format(
        email=email,
        link=link,
    )
    
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=None,
        to=(email, ),
    )

    email.send()
