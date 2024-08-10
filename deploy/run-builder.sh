#!/bin/bash

cp .env ./frontend/.env
docker build \
    -f ./frontend/Dockerfile -t frontend-build ./frontend
docker run -v frontend-dist:/frontend/dist -t frontend-build
rm -f ./frontend/.env
