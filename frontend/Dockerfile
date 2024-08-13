FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /frontend
COPY ./package.json .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

COPY . .

ARG BUILD_DATE
ENV VITE_BUILD_TIMESTAMP=${BUILD_DATE}

SHELL ["/bin/bash", "-c"]
ENTRYPOINT VITE_BUILD_TIMESTAMP=${VITE_BUILD_TIMESTAMP} pnpm run build
