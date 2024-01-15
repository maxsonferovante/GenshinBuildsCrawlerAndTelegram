FROM node:alpine

FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /usr/app

COPY package*.json ./
COPY .env ./

RUN npm install

RUN npm install @playwright/browser-chromium

CMD [ "npm", "run", "start" ]



