.EXPORT_ALL_VARIABLES:

bootstrap: env init dev

env:
	cp docker/.env.example docker/.env
	cp packages/auth/src/infra/environment/.env.example packages/auth/src/infra/environment/.env

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

docker_init:
	@docker-compose \
		-f docker/local.yml \
		-f docker/base.yml \
		pull

docker_dev:
	@docker-compose \
		-f docker/local.yml \
		-f docker/base.yml \
		up -d

docker_build:
	@docker-compose \
		-f docker/local.yml \
		-f docker/base.yml \
		build

docker_stop:
	@docker-compose \
		-f docker/local.yml \
		-f docker/base.yml \
		stop

k8s_init: k8s_env
	@kind create cluster

k8s_env:
	@kubectl delete configmap server-env
	@kubectl delete configmap server-auth-env
	@sleep 5
	@kubectl create configmap server-env --from-env-file=docker/.env
	@kubectl create configmap server-auth-env --from-env-file=packages/auth/src/infra/environment/.env

k8s_dev:
	@skaffold dev --port-forward

k8s_debug:
	@skaffold debug --port-forward

k8s_stop:
	@skaffold delete
