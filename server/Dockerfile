# ----- Builder Stage -----
FROM node:16-slim AS builder

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

COPY package*.json ./
RUN npm install

COPY . ./

RUN npm run build

# ----- Release Stage -----
FROM node:16-slim AS release

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 8080

CMD ["npm", "run", "start"]
