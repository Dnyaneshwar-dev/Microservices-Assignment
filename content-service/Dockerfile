FROM node:17-alpine

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . .


CMD [ "npm" ,"start"]
