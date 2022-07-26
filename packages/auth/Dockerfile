FROM node:16.16.0 AS BUILDER

WORKDIR /app

COPY package.json yarn* /app/

RUN yarn install

FROM node:16.16.0

WORKDIR /app

COPY --from=BUILDER ./app/node_modules /app/node_modules

COPY . /app/

RUN yarn build

EXPOSE 3001

CMD ["node", "dist/presentation/index.js"]
