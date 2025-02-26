# References
# https://testdriven.io/blog/dockerizing-django-with-postgres-gunicorn-and-nginx/#postgres
# https://hub.docker.com/_/python
# https://blog.annotation-ai.com/python-docker-img-optimization/
# https://www.psycopg.org/psycopg3/docs/basic/install.html

FROM python:3.13.1-alpine3.19

WORKDIR /backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apk update
RUN apk add curl
RUN apk add gcc
RUN apk add libc-dev
RUN apk add libffi-dev

RUN pip install --upgrade pip
# requirements.txt를 분리해서 다른 파일이 변경되더라도 재install 하지 않음 
COPY ./requirements.txt . 
# Peak/에서 docker-compose를 실행하더라도 경로는 ./backend가 아닌, 그냥 .
RUN pip install -r requirements.txt

COPY . .

# copy static files
WORKDIR /static
RUN cp -r /usr/local/lib/python3.13/site-packages/django/contrib/admin/static/ /static
RUN cp -r /usr/local/lib/python3.13/site-packages/rest_framework/static/ /static

WORKDIR /backend

HEALTHCHECK --interval=30s --timeout=5s --start-period=2s --retries=5 CMD curl --fail http://127.0.0.1:8000/health/ok