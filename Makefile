.EXPORT_ALL_VARIABLES:

bootstrap: env init

env:
	cp docker/.env.example docker/.env
	cp packages/auth/src/infra/environment/.env.example packages/auth/src/infra/environment/.env

init: docker_init k8s_init

dev: docker_dev

build: docker_build

start: dev

docker_init:
	@docker-compose \
		-f docker/common.yml \
		-f docker/packages.yml \
		pull

docker_common_dev:
	@docker-compose -f docker/common.yml up

docker_database_create:
	@docker-compose -f docker/common.yml exec server-postgres psql -U postgres -c 'CREATE DATABASE auth WITH ENCODING UTF8;'

docker_dev:
	@docker-compose -f docker/packages.yml up

docker_build:
	@docker-compose \
		-f docker/common.yml \
		-f docker/packages.yml \
		build

docker_stop:
	@docker-compose \
		-f docker/common.yml \
		-f docker/packages.yml \
		stop

k8s_init:
	@kind create cluster
	sleep 2
	@make k8s_env_create
	@make k8s_dashboard

k8s_env:
	@make k8s_env_delete
	@sleep 2
	@make k8s_env_create

k8s_env_delete:
	@kubectl delete configmap server-env
	@kubectl delete configmap server-auth-env

k8s_env_create:
	@kubectl create configmap server-env --from-env-file=docker/.env
	@kubectl create configmap server-auth-env --from-env-file=packages/auth/src/infra/environment/.env

k8s_common_run:
	@skaffold -f k8s/skaffold/skaffold.common.yml run

k8s_common_dev:
	@skaffold -f k8s/skaffold/skaffold.common.yml dev --port-forward

k8s_common_debug:
	@skaffold -f k8s/skaffold/skaffold.common.yml debug --port-forward

k8s_common_stop:
	@skaffold -f k8s/skaffold/skaffold.common.yml delete

k8s_run:
	@skaffold -f k8s/skaffold/skaffold.packages.yml run

k8s_dev:
	@skaffold -f k8s/skaffold/skaffold.packages.yml dev --port-forward

k8s_debug:
	@skaffold -f k8s/skaffold/skaffold.packages.yml debug --port-forward

k8s_build:
	@skaffold -f k8s/skaffold/skaffold.packages.yml build

k8s_stop: k8s_common_stop
	@skaffold -f k8s/skaffold/skaffold.packages.yml delete

k8s_dashboard:
	@kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.5.0/aio/deploy/recommended.yaml

k8s_database_create:
	@kubectl exec -it deployment/server-postgres -- psql -U postgres -c 'CREATE DATABASE auth WITH ENCODING UTF8;'
