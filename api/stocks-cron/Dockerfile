FROM node:14-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

COPY app/ .

RUN npm install
RUN npm audit fix

CMD ["node", "app.js"]

