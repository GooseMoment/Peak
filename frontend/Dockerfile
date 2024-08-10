FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ARG VITE_API_BASEURL
ARG VITE_VAPID_PUBLIC_KEY

ENV VITE_API_BASEURL=$VITE_API_BASEURL
ENV VITE_VAPID_PUBLIC_KEY=$VITE_VAPID_PUBLIC_KEY

COPY . /frontend
WORKDIR /frontend

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod 

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build

FROM base
COPY --from=prod-deps /frontend/node_modules /frontend/node_modules
COPY --from=build /frontend/dist /frontend/dist

CMD ["echo", "DONE"]
