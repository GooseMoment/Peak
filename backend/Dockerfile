# References
# https://testdriven.io/blog/dockerizing-django-with-postgres-gunicorn-and-nginx/#postgres
# https://hub.docker.com/_/python
# https://blog.annotation-ai.com/python-docker-img-optimization/
# https://www.psycopg.org/psycopg3/docs/basic/install.html

FROM python:3.13.5-alpine3.21

WORKDIR /backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN pip install --upgrade pip
# requirements.txt를 분리해서 의존성이 변경되지 않으면 pip install을 실행하지 않음
COPY ./requirements.txt . 
RUN pip install -r requirements.txt

COPY . .

# copy static files
WORKDIR /static
RUN cp -r /usr/local/lib/python3.13/site-packages/django/contrib/admin/static/ /static
RUN cp -r /usr/local/lib/python3.13/site-packages/rest_framework/static/ /static

WORKDIR /backend

HEALTHCHECK --interval=30s --timeout=5s --start-period=2s --retries=5 CMD \
    wget --server-response http://127.0.0.1:8000/health/ok/ -O /dev/null
