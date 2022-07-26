.EXPORT_ALL_VARIABLES:

bootstrap: env init

env:
	cp src/infra/environment/.env.example src/infra/environment/.env

init:
	yarn install
	make docker_build
	make k8s_prepare

start:
	NODE_ENV=development node dist/presentation/index.js

kill:
	make docker_stop
	make k8s_stop
	lsof -i tcp:3001 | awk 'NR!=1 {print $2}' | xargs kill

docker_dev:
	@docker-compose \
		-f src/infra/container/docker/local.yml \
		up -d

docker_build:
	@docker-compose \
		-f src/infra/container/docker/local.yml \
		build

docker_stop:
	@docker-compose \
		-f src/infra/container/docker/local.yml \
		stop

k8s_prepare:
	@kubectl create configmap server-auth-env --from-env-file=src/infra/environment/.env
	@kind create cluster

k8s_run:
	@skaffold -f src/infra/container/k8s/skaffold.yml run

k8s_dev:
	@skaffold \
		-f src/infra/container/k8s/skaffold.yml \
		dev --port-forward

k8s_stop:
	@skaffold -f src/infra/container/k8s/skaffold.yml delete
