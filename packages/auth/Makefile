.EXPORT_ALL_VARIABLES:

bootstrap: env init k8s_env_create

env:
	cp src/infra/environment/.env.example src/infra/environment/.env

init:
	yarn install
	make docker_init
	make k8s_init

start:
	yarn start

kill:
	make docker_stop
	make k8s_stop
	lsof -i tcp:3001 | awk 'NR!=1 {print $2}' | xargs kill

docker_init:
	@docker-compose \
		-f src/infra/container/docker/base.yml \
		pull

docker_dev:
	@docker-compose \
		-f src/infra/container/docker/base.yml \
		up -d

docker_build:
	@docker-compose \
		-f src/infra/container/docker/base.yml \
		build

docker_stop:
	@docker-compose \
		-f src/infra/container/docker/base.yml \
		stop

k8s_init: k8s_env_create
	@kind create cluster

k8s_env:
	@kubectl delete configmap server-auth-env
	@sleep 2
	@make k8s_env_create

k8s_env_create:
	@kubectl create configmap server-auth-env --from-env-file=src/infra/environment/.env

k8s_run:
	@skaffold run

k8s_dev:
	@skaffold dev

k8s_debug:
	@skaffold debug

k8s_stop:
	@skaffold delete
