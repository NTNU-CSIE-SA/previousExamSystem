FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json  ./
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate
RUN pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html