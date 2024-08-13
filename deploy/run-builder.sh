#!/bin/bash

docker build \
    -f ./frontend/Dockerfile \
    -t frontend-build ./frontend
docker run \
    -v frontend-dist:/frontend/dist \
    -v ./.env:/.env:ro \
    -t frontend-build
