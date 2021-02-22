FROM node:14.14.0-alpine3.12

# RUN mkdir -p /usr/src/app

COPY . /usr/src/app

WORKDIR /usr/src/app

# RUN npm cache clean --force

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
