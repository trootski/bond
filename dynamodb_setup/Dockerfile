FROM node:12-alpine

WORKDIR /opt/bondmoviesdb

# Copy script which should be run
RUN mkdir -p /opt/bondmoviesdb/app

COPY package.json /opt/bondmoviesdb
COPY package-lock.json /opt/bondmoviesdb
RUN npm ci

COPY config/config.json /opt/bondmoviesdb
COPY app/*.js /opt/bondmoviesdb/app/

CMD [ "node", "app/setup.js" ];
