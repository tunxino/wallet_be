FROM node:23

WORKDIR /usr/src/app

COPY . .

RUN npm i

EXPOSE 3000

CMD ["npm", "run", "start:dev"]


