FROM node:12-alpine

RUN mkdir -p /opt/watch_reviews
WORKDIR /opt/watch_reviews

RUN apk add --update python && rm -rf /var/cache/apk/*
RUN apk add --update bash && rm -rf /var/cache/apk/*

COPY ./package.json /opt/watch_reviews
COPY ./package-lock.json /opt/watch_reviews
RUN npm ci

COPY ./app /opt/watch_reviews/app
COPY ./config /opt/watch_reviews/config

CMD ["node", "/opt/watch_reviews/app/setup.js"]

