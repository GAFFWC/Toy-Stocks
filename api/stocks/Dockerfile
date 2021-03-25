# BUILD
FROM node:14-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm audit fix
RUN npm run build

# PROD
FROM node:14-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY .env.prod /app/.env.prod

CMD ["npm", "run", "start:prod"]