FROM node:24-alpine

RUN apk add --update bash && rm -rf /var/cache/apk/*

WORKDIR /opt/movie-metadata-api

# Copy script which should be run
RUN mkdir -p /opt/movie-metadata-api/app

COPY ./package.json /opt/movie-metadata-api
COPY ./package-lock.json /opt/movie-metadata-api
RUN npm ci

COPY ./app/ /opt/movie-metadata-api/app
COPY ./config/ /opt/movie-metadata-api/config/

CMD [ "node", "app/server.js" ]
