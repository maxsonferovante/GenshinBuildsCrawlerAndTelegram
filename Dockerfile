FROM node:21-alpine3.18

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
COPY .env ./
COPY . .

RUN npm install
RUN npm install dotenv
RUN npx prisma generate

CMD [ "npm", "run", "start:migrate" ]



