#* ✈️ Production 
FROM node:20-alpine AS dev

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4001

CMD [ "npm", "run", "start" ]