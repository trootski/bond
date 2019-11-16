FROM node:12-alpine

RUN mkdir -p /opt/koa-service/app

WORKDIR /opt/koa-service

COPY package.json /opt/koa-service
COPY package-lock.json /opt/koa-service
RUN npm ci

COPY app/*.js /opt/koa-service/app/
COPY app/api /opt/koa-service/app/api

EXPOSE 3000
CMD [ "node", "app/server.js" ];

