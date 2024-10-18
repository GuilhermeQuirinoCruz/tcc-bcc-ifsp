FROM node:latest
WORKDIR /api
COPY hello-node.js /api/hello-node.js
COPY ../../API/src /api/src
COPY ../../API/index.js /api/index.js
COPY ../../API/package.json /api/package.json
RUN npm i express
RUN npm i cors
CMD node /api/index

EXPOSE 3000