FROM node:12-alpine
WORKDIR /app

COPY . .

RUN npm install --production
RUN nodejs install.js

# delete npm and libs to reduce image size
RUN rm -r /opt/*
RUN rm -r /tmp/*
RUN rm -rf /root/*
RUN rm -r /usr/local/lib/node_modules/npm
RUN rm -r /usr/local/include/node
RUN rm /usr/local/bin/npm

CMD [ "nodejs", "run.js" ]