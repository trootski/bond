FROM node:10-alpine

# Copy script which should be run
RUN mkdir -p /opt/cache_sync/app
COPY ./config/ /opt/cache_sync/config
COPY ./app/setup.js /opt/cache_sync/app
COPY ./package.json /opt/cache_sync
COPY ./package-lock.json /opt/cache_sync
RUN chmod +x /opt/cache_sync/app/setup.js

# Run the cron every minute
RUN echo '*  *  *  *  *    cd /opt/cache_sync/ && ./app/setup.js' > /etc/crontabs/root

WORKDIR /opt/cache_sync
RUN npm ci
RUN apk add --update bash && rm -rf /var/cache/apk/*

#CMD ["sleep", "1000"]
CMD /usr/sbin/crond -f -l 2
