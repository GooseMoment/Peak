FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /frontend
COPY ./package.json .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

COPY . .

CMD ["pnpm", "run", "build"]
