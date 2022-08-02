FROM node:16.16.0 AS BUILDER

WORKDIR /app

COPY package.json yarn* /app/

RUN yarn install

FROM node:16.16.0

WORKDIR /app

COPY --from=BUILDER ./app/node_modules /app/node_modules

COPY . /app/

RUN yarn build

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait

RUN chmod +x /wait

EXPOSE 3001

CMD /wait && node dist/presentation/index.js
