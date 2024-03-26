FROM node:21-alpine3.19
WORKDIR /frontend
COPY ./package* .
RUN npm install
COPY . .
CMD npm run build