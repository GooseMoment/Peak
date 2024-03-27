"""
Django settings for django_peak project.

Generated by 'django-admin startproject' using Django 4.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


env_check = os.environ.get("DEBUG")
if env_check is None:
    print("******************************************************************************")
    print("*환경변수가 설정되지 않았습니다. 도커 환경이 아니거나 구성에 문제가 있습니다.*")
    print("******************************************************************************")

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-87%a)!2$$9_yizx8(%n%as513jq94o8(iuquctgpgxgic=+s7=")

DEBUG = os.environ.get("DEBUG", "1") == "1"

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(" ")

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'api',

    'users',
    'tasks',
    'drawers',
    'projects',
    'social',
    'notifications',

    # 'today',
    # 'search',
    # 'user_setting',

    'rest_framework',
    'corsheaders',
    'dummies',
]

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}

MIDDLEWARE = [
    'api.middleware.DisableCSRFMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

AUTH_USER_MODEL = "users.User"

ROOT_URLCONF = 'django_peak.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'django_peak.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': os.environ.get("SQL_ENGINE", 'django.db.backends.postgresql'),
        'NAME': os.environ.get("SQL_DATABASE", 'peakdb'),
        'USER': os.environ.get("SQL_USER", 'peakuser'),
        'PASSWORD': os.environ.get("SQL_PASSWORD", 'PEAK_DEFAULT_PASSWORD'),
        'HOST': os.environ.get("SQL_HOST", '127.0.0.1'),
        'PORT': os.environ.get("SQL_PORT", '5432'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Authentication Backend
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "users.auth.UserBackend",
]

# CSRF
# https://docs.djangoproject.com/en/5.0/howto/csrf/#how-to-use-django-s-csrf-protection
# CSRF_USE_SESSIONS = False
# CSRF_COOKIE_HTTPONLY = False
# CSRF_COOKIE_NAME = "EXHALATION" # 임의의 이름...
# CSRF_HEADER_NAME = "INHALATION"
# TODO: Turn on CSRF

# CORS
# https://github.com/adamchainz/django-cors-headers?tab=readme-ov-file#configuration
CORS_ALLOWED_ORIGINS = [
    "https://peak.ooo",
    "http://localhost:8000",
]

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^http:\/\/127\.0\.0\.1:((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$",
    r"^http:\/\/localhost:((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$",
]

CORS_ALLOW_CREDENTIALS = True

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# TODO: EMAIL_BACKEND