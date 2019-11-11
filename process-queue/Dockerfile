FROM node:10-alpine

RUN apk add --update python && rm -rf /var/cache/apk/*
RUN apk add --update bash && rm -rf /var/cache/apk/*

RUN mkdir -p /opt/process_queue/app
WORKDIR /opt/process_queue

# Copy script which should be run
COPY ./package.json /opt/process_queue
COPY ./package-lock.json /opt/process_queue/

RUN npm ci

COPY ./config/ /opt/process_queue/config
COPY ./app/*.js /opt/process_queue/app/

CMD ["node", "/opt/process_queue/app/setup.js"]
