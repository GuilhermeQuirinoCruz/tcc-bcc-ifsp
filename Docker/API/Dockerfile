FROM node:latest
WORKDIR /api
COPY ./src /api/src
COPY index.js /api/index.js
COPY db-config.js /api/db-config.js
COPY package.json /api/package.json
RUN npm install
RUN npm i express
RUN npm i cors
RUN npm i pg
CMD node /api/index.js

EXPOSE 3000