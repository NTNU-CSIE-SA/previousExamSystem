FROM node:22-alpine

WORKDIR /app

COPY . /app

RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

RUN pnpm install
RUN pnpm build