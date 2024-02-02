#!/bin/bash

# First pull in environmental variables for build time uses

# Recreate config file
rm -rf ./frontend/public/env-config.js
touch ./frontend/public/env-config.js

# Add assignment 
echo "window._env_ = {" >> ./frontend/public/env-config.js

# Read each line in .env file
# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]];
do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varname}")
  # Otherwise use value from .env file
  [[ -z $value ]] && value=${varvalue}
  
  # Append configuration property to JS file
  echo "  $varname: \"$value\"," >> ./frontend/public/env-config.js
done < .env

echo "}" >> ./frontend/public/env-config.js

##############################
# This builds and pushes both the nginx/React image
# and the DRF one.  
#
# The nginx/React image gets built with an environment variable
# that sets the url of the DRF backend REACT_APP_BASE_URL.  Once you
# know the IP address of your EC2 instance, you would pass that in
# instead of localhost
##############################

DOCKERHUB_UNAME=bmitchum

BASE_URL=$1
NEW_VERSION=$2

docker build --build-arg BASE_URL=$BASE_URL -t $DOCKERHUB_UNAME/woutfh_webserver-prod:$NEW_VERSION -f webserver/Dockerfile . --no-cache
docker push $DOCKERHUB_UNAME/woutfh_webserver-prod:$NEW_VERSION

docker build -t $DOCKERHUB_UNAME/woutfh_api-prod:$NEW_VERSION -f backend/Dockerfile ./backend --no-cache
docker push $DOCKERHUB_UNAME/woutfh_api-prod:$NEW_VERSION