.EXPORT_ALL_VARIABLES:

bootstrap: env init dev

env:
	cp .env.example .env

up:
	docker-compose -f src/infra/container/docker/compose.yml up -d

pull:
	docker-compose -f src/infra/container/docker/compose.yml pull

init: pull
	yarn install

build:
	rimraf dist && tsc -p tsconfig.json

dev:
	NODE_ENV=development tsnd --respawn -r tsconfig-paths/register src/presentation/index.ts

start: dev

unit:
	yarn unit

integration:
	yarn integration

kill:
	lsof -i tcp:3001 | awk 'NR!=1 {print $2}' | xargs kill
