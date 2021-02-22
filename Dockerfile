FROM node:12.1.0

# RUN mkdir -p /usr/src/app

COPY . /app

WORKDIR /app

RUN npm cache verify

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
