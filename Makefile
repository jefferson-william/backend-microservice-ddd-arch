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

build:
	yarn build

start: dev

docker_prepare:
	@docker-compose -f packages/@local/src/infra/container/docker/local.yml \
		-f packages/auth/src/infra/container/docker/local.yml \
		pull

docker_dev:
	@docker-compose -f packages/@local/src/infra/container/docker/local.yml \
		-f packages/auth/src/infra/container/docker/local.yml \
		up -d

docker_build:
	@docker-compose \
		-f packages/auth/src/infra/container/docker/local.yml \
		build

docker_stop:
	@docker-compose -f packages/@local/src/infra/container/docker/local.yml \
		-f packages/auth/src/infra/container/docker/local.yml \
		stop

k8s_prepare:
	@kind create cluster

k8s_dev:
	@skaffold dev --port-forward

k8s_stop:
	@skaffold delete
