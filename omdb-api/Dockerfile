FROM node:12-alpine

RUN apk add --update bash && rm -rf /var/cache/apk/*

WORKDIR /opt/omdb-api

# Copy script which should be run
RUN mkdir -p /opt/omdb-api/app

COPY ./package.json /opt/omdb-api
COPY ./package-lock.json /opt/omdb-api
RUN npm ci

COPY ./app/ /opt/omdb-api/app
COPY ./config/ /opt/omdb-api/config/

CMD [ "node", "app/server.js" ];
