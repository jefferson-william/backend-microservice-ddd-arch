.EXPORT_ALL_VARIABLES:

bootstrap: env

env:
	cp docker/.env.example docker/.env
	cp packages/auth/src/infra/environment/.env.example packages/auth/src/infra/environment/.env

up:
	yarn up

pull:
	yarn pull

init: pull

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

k8s_init: k8s_env_create
	@kind create cluster

k8s_env:
	@kubectl delete configmap server-env
	@kubectl delete configmap server-auth-env
	@sleep 2
	@make k8s_env_create

k8s_env_create:
	@kubectl create configmap server-env --from-env-file=docker/.env
	@kubectl create configmap server-auth-env --from-env-file=packages/auth/src/infra/environment/.env

k8s_run:
	@skaffold run

k8s_dev:
	@skaffold dev

k8s_debug:
	@skaffold debug

k8s_stop:
	@skaffold delete
