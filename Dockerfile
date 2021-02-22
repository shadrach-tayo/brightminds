FROM node:14.14.0-alpine3.12

WORKDIR /src/app

COPY package*.json ./

# RUN npm cache clean --force

RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
