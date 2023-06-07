FROM node:19.3.0 
 
WORKDIR /backend 

COPY package.json .
RUN npm install

COPY . .

EXPOSE 4000
CMD ["node","server.js"]
