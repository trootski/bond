FROM ubuntu:18.04

ENV TARGET="v10.15.3"

RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

RUN wget --no-verbose http://nodejs.org/dist/"${TARGET}"/node-"${TARGET}"-linux-x64.tar.gz \
    && tar xzf node-"${TARGET}"-linux-x64.tar.gz \
    && cp -rp node-"${TARGET}"-linux-x64 /usr/local/ \
    && ln -s /usr/local/node-"${TARGET}"-linux-x64/bin/node /usr/local/bin \
    && ln -s /usr/local/node-"${TARGET}"-linux-x64/bin/npm /usr/local/bin

RUN mkdir -p /opt/bondmoviesdb

WORKDIR /opt/bondmoviesdb

COPY package.json /opt/bondmoviesdb
COPY package-lock.json /opt/bondmoviesdb
COPY config.json /opt/bondmoviesdb
COPY setup.js /opt/bondmoviesdb
COPY list-tables.js /opt/bondmoviesdb
COPY show-bond-movies-content.js /opt/bondmoviesdb

RUN npm ci

CMD [ "node", "setup.js" ];
