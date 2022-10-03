FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run prebuild
RUN npm run build

CMD ["node", "dist/main.js"]