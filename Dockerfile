FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000
CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"]
