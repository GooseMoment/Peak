from django.core.mail import EmailMultiAlternatives
from django.template import loader
from django.conf import settings

from .models import User, EmailVerificationToken
from .locale import get_translations

def send_mail_confirm_email(user: User, verification: EmailVerificationToken):
    t = get_translations(verification.locale)["mail_confirm_email"]

    link = verification.link

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
