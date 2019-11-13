FROM node:12-alpine

RUN mkdir -p /opt/queue_setup/app
WORKDIR /opt/queue_setup

RUN apk add --update python && rm -rf /var/cache/apk/*

RUN apk add --update bash && rm -rf /var/cache/apk/*

COPY ./package.json /opt/queue_setup
COPY ./package-lock.json /opt/queue_setup
RUN npm ci

COPY ./config/ /opt/queue_setup/config
COPY ./app/setup.js /opt/queue_setup/app
RUN chmod +x /opt/queue_setup/app/setup.js

# Uncomment the following if you would like to debug
# EXPOSE 9229
# CMD ["node", "--inspect-brk=0.0.0.0", "/opt/queue_setup/app/setup.js"]
CMD ["node", "/opt/queue_setup/app/setup.js"]

