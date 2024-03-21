FROM node:21-alpine3.19
WORKDIR /landing
COPY ./package* .
RUN npm install
COPY . .
RUN rm -rf .parcel-cache||true
CMD npm run build