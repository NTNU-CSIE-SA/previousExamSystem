FROM node:22-alpine

WORKDIR /app

COPY ./* /app
COPY ../watermark.png /app

RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

RUN pnpm install --prod
RUN pnpm build

EXPOSE 5000

CMD [ "pnpm start" ]