FROM node:12-alpine

RUN mkdir -p /opt/bond-movies-api/app

WORKDIR /opt/bond-movies-api

COPY ./packages /opt/packages
COPY ./bond-movies-api/package.json /opt/bond-movies-api
COPY ./bond-movies-api/package-lock.json /opt/bond-movies-api
RUN npm ci

COPY ./bond-movies-api/app/ /opt/bond-movies-api/app/

EXPOSE 3000
CMD [ "node", "app/server.js" ];

