FROM node:22-alpine

WORKDIR /app

COPY package.json /app

RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

RUN pnpm install
COPY . /app
RUN pnpm build