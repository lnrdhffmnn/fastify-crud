FROM node:alpine

WORKDIR /app

COPY package*.json .
RUN npm i

COPY . .
RUN npm run build
RUN npm run prisma:migrate

EXPOSE 3000

CMD npm run start
