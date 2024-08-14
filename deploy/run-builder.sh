#!/bin/bash

BUILD_DATE=$(date '+%Y-%m-%dT%H:%M:%S%z')

docker build \
    -f ./frontend/Dockerfile \
    --build-arg "BUILD_DATE=${BUILD_DATE}" \
    -t frontend-build ./frontend

docker run \
    -v frontend-dist:/frontend/dist \
    -v ./.env:/.env:ro \
    -t frontend-build
