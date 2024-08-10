FROM node:21-alpine3.19
WORKDIR /frontend
COPY ./package* .
RUN pnpm install
COPY . .
CMD pnpm run build