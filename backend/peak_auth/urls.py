from django.urls import path

from . import views
from knox import views as knox_views

urlpatterns = [
    path("password_recovery/", views.PasswordRecoveryView.as_view()),
    path("sign_in/", views.SignInView.as_view(), name="knox_login"),
    path(
        "two_factor/totp/",
        views.TOTPAuthenticationView.as_view(),
        name="auth_two_factor",
    ),
    path(
        "two_factor/totp/register/", views.TOTPRegisterView.as_view(), name="new_totp"
    ),
    path("sign_out/", knox_views.LogoutView.as_view(), name="knox_logout"),
    path("sign_out_all/", knox_views.LogoutAllView.as_view(), name="knox_logoutall"),
    path("sign_up/", views.sign_up),
    path("sign_up/verification/", views.VerifyEmailVerificationToken.as_view()),
    path("sign_up/verification/resend/", views.ResendEmailVerificationMail.as_view()),
]
