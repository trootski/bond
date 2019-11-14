FROM node:12-alpine

RUN mkdir -p /opt/dynamodb_setup/app

WORKDIR /opt/dynamodb_setup

COPY package.json /opt/dynamodb_setup
COPY package-lock.json /opt/dynamodb_setup
RUN npm ci

COPY app/*.js /opt/dynamodb_setup/app/

CMD [ "node", "app/setup.js" ];
