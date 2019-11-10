FROM node:10-alpine

RUN apk add --update python && rm -rf /var/cache/apk/*

RUN apk add --update bash && rm -rf /var/cache/apk/*

# Copy script which should be run
RUN mkdir -p /opt/process_queue/app
COPY ./config/ /opt/process_queue/config
COPY ./app/setup.js /opt/process_queue/app
COPY ./app/test-getItem.js /opt/process_queue/app
COPY ./package.json /opt/process_queue
COPY ./package-lock.json /opt/process_queue
RUN chmod +x /opt/process_queue/app/setup.js

WORKDIR /opt/process_queue

RUN npm ci

CMD ["node", "/opt/process_queue/app/setup.js"]

