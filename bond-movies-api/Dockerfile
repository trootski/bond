FROM node:12-alpine

RUN mkdir -p /opt/bond-movies-api/app

WORKDIR /opt/bond-movies-api

COPY ./package.json /opt/bond-movies-api
COPY ./package-lock.json /opt/bond-movies-api
RUN npm ci

COPY ./app/ /opt/bond-movies-api/app/
COPY ./config/ /opt/bond-movies-api/config/

EXPOSE 3000
CMD [ "node", "app/server.js" ];

