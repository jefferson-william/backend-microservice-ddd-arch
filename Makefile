.EXPORT_ALL_VARIABLES:

bootstrap: env init dev

env:
	yarn env

up:
	yarn up

pull:
	yarn pull

init: pull
	yarn install

dev:
	yarn dev

start: dev
