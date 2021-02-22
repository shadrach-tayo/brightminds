FROM node:12.1.0

# RUN mkdir -p /usr/src/app

COPY . /app

WORKDIR /app

RUN rm -rf node_modules package-lock.json

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
