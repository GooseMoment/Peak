# build environment 
FROM node:21-alpine3.19 as build
WORKDIR /frontend
COPY ./frontend .
RUN npm install
RUN npm run build

WORKDIR /landing
COPY ./landing .
RUN npm install
RUN npm run build

# production environment
FROM caddy:2.7.6-builder-alpine
COPY --from=build /landing/dist /usr/share/caddy/landing
COPY --from=build /frontend/dist /usr/share/caddy/frontend