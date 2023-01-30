FROM node:latest

RUN mkdir /storage

WORKDIR /codersquare

COPY . .

RUN npm install

CMD ["npm", "start"]
