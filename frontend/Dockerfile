FROM node:19.3.0 as build-stage 

WORKDIR /frontend

COPY package.json .
RUN npm install
COPY . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]