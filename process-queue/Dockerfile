FROM node:12-alpine

RUN apk add --update python && rm -rf /var/cache/apk/*
RUN apk add --update bash && rm -rf /var/cache/apk/*

RUN mkdir -p /opt/process_queue/app
WORKDIR /opt/process_queue

# Copy script which should be run
COPY ./package.json /opt/process_queue
COPY ./package-lock.json /opt/process_queue/

RUN npm ci

COPY ./app/*.js /opt/process_queue/app/

# Uncomment the following if you would like to debug
# EXPOSE 9229
# CMD ["node", "--inspect-brk=0.0.0.0", "/opt/process_queue/app/setup.js"]
CMD ["node", "/opt/process_queue/app/setup.js"]
