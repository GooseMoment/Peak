FROM node:lts-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack use pnpm@10.x
RUN corepack enable

WORKDIR /frontend

COPY ./package.json .
COPY ./pnpm-lock.yaml .
COPY ./.npmrc .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

ARG BUILD_DATE
ENV VITE_BUILD_TIMESTAMP=${BUILD_DATE}

SHELL ["/bin/sh", "-c"]
ENTRYPOINT VITE_BUILD_TIMESTAMP=${VITE_BUILD_TIMESTAMP} pnpm build
