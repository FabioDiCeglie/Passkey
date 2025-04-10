FROM node:19
WORKDIR /usr/src/app

COPY package.json .
RUN pnpm install

COPY . /usr/src/app/

CMD ["npx", "nodemon", "index.js"]