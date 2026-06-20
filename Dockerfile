FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 6000
CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"]
