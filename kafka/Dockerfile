FROM node:10-alpine

RUN apk add --update python && rm -rf /var/cache/apk/*

RUN apk add --update bash && rm -rf /var/cache/apk/*

# Copy script which should be run
RUN mkdir -p /opt/kafka_setup/app
COPY ./config/ /opt/kafka_setup/config
COPY ./app/setup.js /opt/kafka_setup/app
COPY ./package.json /opt/kafka_setup
COPY ./package-lock.json /opt/kafka_setup
RUN chmod +x /opt/kafka_setup/app/setup.js

WORKDIR /opt/kafka_setup

RUN npm ci

CMD ["node", "/opt/kafka_setup/app/setup.js"]

