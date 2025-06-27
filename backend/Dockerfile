FROM node:22-bookworm

WORKDIR /app

COPY package.json /app
COPY .env /app
RUN apt-get update && apt-get install -y sqlite3

RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

RUN pnpm install
COPY . /app
RUN pnpm build