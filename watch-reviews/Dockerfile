FROM node:12-alpine

RUN mkdir -p /opt/watch_reviews/app
WORKDIR /opt/watch_reviews

RUN apk add --update python && rm -rf /var/cache/apk/*
RUN apk add --update bash && rm -rf /var/cache/apk/*

COPY ./package.json /opt/watch_reviews
COPY ./package-lock.json /opt/watch_reviews
RUN npm ci

COPY ./app/setup.js /opt/watch_reviews/app
RUN chmod +x /opt/watch_reviews/app/setup.js

CMD ["node", "/opt/watch_reviews/app/setup.js"]

