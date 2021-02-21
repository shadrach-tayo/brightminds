FROM node:14.14.0-alpine3.12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
# RUN npm clean cache --force
CMD ["npm", "start"]
