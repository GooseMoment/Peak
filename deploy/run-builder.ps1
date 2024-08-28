$BUILD_DATE = Get-Date -Format "yyyy-MM-ddTHH:mm:sszzz"

docker build `
    -f ./frontend/Dockerfile `
    --build-arg "BUILD_DATE=$BUILD_DATE" `
    -t frontend-build ./frontend

docker run `
    -v frontend-dist:/frontend/dist `
    -v ${PWD}/.env:/.env:ro `
    -t frontend-build