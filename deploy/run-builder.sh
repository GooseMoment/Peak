docker build -f ./"$1"/Dockerfile -t "$1"-build ./"$1"
docker run -v "$1"-dist:/"$1"/dist -t "$1"-build