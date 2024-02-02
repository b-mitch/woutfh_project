#!/bin/sh

# The Dockerhub account where the images are stored
export DOCKERHUB_UNAME=bmitchum

# These environment variables come from command line arguments.
# They are consumed by the docker-compose file.
export SECRET_KEY=$1
export DB_NAME=$2
export DB_USER=$3
export DB_PASS=$4
export DB_HOST=$5
export EMAIL_PASSWORD=$6
export NEW_VERSION=$7

docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# make sure the postgres container is ready, then run migrations
sleep 10 
docker exec woutfh_prod-api-1 python /src/manage.py makemigrations 
docker exec woutfh_prod-api-1 python /src/manage.py migrate
