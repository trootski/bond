FROM node:10-alpine

RUN apk add --update python && rm -rf /var/cache/apk/*

RUN apk add --update bash && rm -rf /var/cache/apk/*

# Copy script which should be run
RUN mkdir -p /opt/watch_reviews/app
COPY ./config/ /opt/watch_reviews/config
COPY ./app/setup.js /opt/watch_reviews/app
COPY ./package.json /opt/watch_reviews
COPY ./package-lock.json /opt/watch_reviews
RUN chmod +x /opt/watch_reviews/app/setup.js

WORKDIR /opt/watch_reviews

RUN npm ci

CMD ["node", "/opt/watch_reviews/app/setup.js"]

