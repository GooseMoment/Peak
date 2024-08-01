from django.core.mail import EmailMultiAlternatives
from django.template import loader
from django.conf import settings

from .models import User, UserEmailConfirmation
from .locale import get_translations

def send_mail_confirm_email(user: User, confirmation: UserEmailConfirmation):
    t = get_translations(confirmation.locale)["mail_confirm_email"]

    link = f"{settings.SCHEME}{settings.WEB_HOSTNAME}/confirmation/?token={confirmation.token}"

    subject = t["subject"]

    text_content = t["text_content"].format(
        username=user.username,
        link=link,
    )
    
    tmpl = loader.get_template("users/mail_confirm_email.html")
    context = {
        "username": user.username,
        "title": t["html_title"],
        "greeting": t["greeting"].format(
            username=user.username,
        ),
        "click_button": t["click_button"],
        "button_link": link,
        "button_confirm": t["button_confirm"].format(
            username=user.username,
        ),
        "copy_link": t["copy_link"],
    }
    html_content = tmpl.render(context)

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=None,
        to=(user.email, ),
    )

    email.attach_alternative(html_content, "text/html")
    email.send()
