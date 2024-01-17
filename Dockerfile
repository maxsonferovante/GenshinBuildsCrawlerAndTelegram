FROM node:alpine

FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app
COPY package*.json ./
COPY ./prisma ./prisma
COPY .env ./
COPY . .

RUN npm install
RUN npm install dotenv
RUN npm install @playwright/browser-chromium
RUN npx prisma generate

CMD [ "npm", "run", "start:migrate" ]



