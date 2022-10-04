FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk --update add --virtual builds-deps build-base python3
RUN npm config set python /usr/bin/python3
RUN npm install --global npm
RUN npm install
RUN npm rebuild bcrypt --build from-source
RUN apk del builds-deps

COPY . .

RUN npm run prebuild
RUN npm run build

CMD ["node", "dist/main.js"]