# build environment 
FROM node:21-alpine3.19 as build-frontend
WORKDIR /frontend
COPY ./frontend .
RUN npm install
RUN npm run build

FROM node:21-alpine3.19 as build-landing
WORKDIR /landing
COPY ./landing .
RUN npm install
RUN rm -rf .parcel-cache||true && npm run build

# production environment
FROM caddy:2.7.6-alpine
COPY --from=build-frontend /frontend/dist /srv/frontend
COPY --from=build-landing /landing/dist /srv/landing