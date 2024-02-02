# Need to add api key and url environment variables?

export SECRET_KEY=abc123
export DEBUG=True
export POSTGRES_DB=woutfh
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=postgres
export EMAIL_PASSWORD=$1
export YOUTUBE_API_KEY=$2

COMPOSE_DOCKER_CLI_BUILD=0 DOCKER_BUILDKIT=0 docker compose -f docker-compose.dev.yml up -d --build

# make sure the postgres container is ready, then run migrations
sleep 10 
docker exec woutfh_prod-api-1 python3 /src/manage.py makemigrations 
docker exec woutfh_prod-api-1  python3 /src/manage.py migrate