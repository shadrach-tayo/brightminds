FROM node:14.14.0-alpine3.12

# RUN mkdir -p /usr/src/app

COPY . /app

WORKDIR /app

RUN npm cache clean

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
