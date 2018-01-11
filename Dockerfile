FROM node:9
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run postinstall
EXPOSE 8080
CMD [ "npm", "start" ]
