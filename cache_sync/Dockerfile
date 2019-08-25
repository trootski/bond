FROM alpine

# Copy script which should be run
COPY ./myawesomescript /usr/local/bin/myawesomescript
# Run the cron every minute
RUN echo '*  *  *  *  *    /usr/local/bin/myawesomescript' > /etc/crontabs/root

CMD ['crond', '-l 2', '-f']
