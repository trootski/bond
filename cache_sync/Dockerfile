FROM node:12-alpine

WORKDIR /opt/cache_sync

# Copy script which should be run
RUN mkdir -p /opt/cache_sync/app

COPY ./package.json /opt/cache_sync
COPY ./package-lock.json /opt/cache_sync
RUN npm ci

COPY ./config /opt/cache_sync/config
COPY ./app/setup.js /opt/cache_sync/app
RUN chmod +x /opt/cache_sync/app/setup.js

# Run the cron every minute
RUN echo '*  *  *  *  *    cd /opt/cache_sync/ && ./app/setup.js' > /etc/crontabs/root
RUN apk add --update bash && rm -rf /var/cache/apk/*

CMD /usr/sbin/crond -f -l 2
