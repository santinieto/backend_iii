FROM node:20.12.2
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
# RUN npm install --only-production
EXPOSE 8080
CMD ["npm", "start"]