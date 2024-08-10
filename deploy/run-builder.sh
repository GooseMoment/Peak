#!/bin/bash

source .env
docker build \
    --build-arg VITE_API_BASEURL=$VITE_API_BASEURL \
    --build-arg VITE_VAPID_PUBLIC_KEY=$VITE_VAPID_PUBLIC_KEY \
    -f ./"$1"/Dockerfile -t "$1"-build ./"$1"
docker run -v "$1"-dist:/"$1"/dist -t "$1"-build
