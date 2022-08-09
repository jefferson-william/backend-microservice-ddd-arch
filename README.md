# server

Projeto que se tornará grande de estudo com DDD, Clean Architecture, Microservice, TDD, SOLID e Design Patterns.

## Resumo

A ideia de criar um projeto que se tornará grande com tempo com vários `packages` veio para praticar várias
**tecnologias, padrões e arquiteturas**.

Cada _package_ será um _Microservice_ com possibilidade do mundo se conectar via REST, Mensageria (básico) e outros
conforme for possível/priorizada implementação (GraphQL, gRPC, Kafka, HabbitMQ, SQS, SNS e etc).

Projeto a estrutura do projeto, pense que cada `packages/<package>` é um _git submodule_. Tanto que é possível
rodar cada um via `docker` ou `skaffold` separadamente mas também todos de uma vez. Note os arquivos `Makefile`.

# Instalações necessárias

Neste projeto terá como formas de execução via **Docker**, **Kubernetes** e **_yarn_** pode ser **Node**. Instale-os para continuar.

## Instalação do Docker e Compose

Instale-os caso queira rodar o projeto via `make docker_dev` e outros comandos disponíveis nos `Makefile`.

- https://docs.docker.com/engine/install/ubuntu/
- https://docs.docker.com/compose/install/

## Instalação do Kubernetes

Instale-o caso queira rodar o projeto via `make k8s_dev` e outros comandos disponíveis nos `Makefile`.

### Instalação do K8S no Linux

```sh
# Instalação para Linux
cd /usr/local/bin
sudo curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
sudo chmod +x /usr/local/bin/kubectl
kubectl version --output=yaml
```

### Instalação do Skaffold no Linux

```sh
cd ~
curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64
sudo install skaffold /usr/local/bin/
```

### Instalação do Kind no Linux

```sh
cd ~
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.14.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

### Referências

- [Instale kubectl e kind pelo site oficial](https://kubernetes.io/docs/tasks/tools/)
- [Instale o Skaffold pelo site oficial](https://skaffold.dev/docs/install/#standalone-binary)
- [Instale o kind no pelo site oficial](https://kind.sigs.k8s.io/docs/user/quick-start/#installing-from-release-binaries)

## Execução

É possível rodar o projeto via comandos presentes nos `Makefile`. Seja via arquivo presente no _root_ ou de cada _package_.

O _Makefile_ do _root_ levanta todos de uma vez. O presente em cada _package_ permite levantar um de cada vez.

- [ ] A implementar: _reverse proxy_ com _Traefik_.

Segue os principais comandos presente em qualquer `Makefile`:

```bash
# Necessário na primeira vez
make bootstrap
# Via docker
make docker_build
make docker_dev # vai ser necessário criar os databases manualmente, pausar e rodar novamente
make docker_stop
# Via kubernetes
make k8s_init
make k8s_common_dev # sempre deve ser rodado num terminal paralelo
make k8s_database_create # criar os databases para rodar as migrações
make k8s_dev # ou k8s_debug deve ser rodado em outro terminal
make k8s_stop # ele deleta os containers mas é assim mesmo que skaffold funciona
make k8s_run # apenas para deploy (não rodar local)
make k8s_env # se alterar algum .env precisa rodar esse comando para atualizar
```

Para testar tudo tem por exemplo esses links e portas abaixo.

```sh
curl http://localhost:3001/health # Aplicação auth básica
curl http://localhost:16543 # pgadmin
```

## Testes

Apliquei um jeito dos testes de _API_ e **integração** rodarem via _Jest_ e via "_memory repository_".

Na prática isso significa que os testes não irão se conectar ao banco de dados permitindo que todos rodem em paralelo
e numa velocidade máxima.

Deixei embutido em cada _package_ com 100% de _coverage_ os testes: API, integração e unitário.

Note os arquivos abaixo para entender melhor:

```
packages/<module>/jest.(api|integration|unit).js
packages/<module>/jest.setup.(api)?.js
packages/<module>/src/test/mocks/index.ts
packages/<module>/src/infra/factory/__mocks__/RepositoryFactory.ts
```

## Pastas

Uma estrutura de pasta comum que encontrei e que mais tem funcionado em disparado no exemplo de _Microservice_ é a seguinte:

```
├── application/       só pode importar domain
|   ├── handler/       normalmente usado nos controllers das mensageria
|   ├── usecase/       orquestradores que retornam DTO e que instanciam entidades para repositórios
|   ├── query/         camada de busca de dados para CQRS
|   ├── mutation/      camada de mutação de dados para CQRS
├── domain/            parte mais core e interna que possui implementações e interfaces
|   ├── entity/        POO e Value Objects com validações ao serem instanciados
|   ├── environment/   implementação das variáveis via env-var
|   ├── constant/      implementação de enum e constantantes
|   ├── error/         classes de erros
|   ├── event/         interface ligada ao type do evento da mensageria
|   ├── factory/       interfaces de boundery context das fábricas
|   ├── repository/    interface dos agregados e repositórios
|   ├── service/       funções ou classes com métodos estáticos que processam dados
├── infra/             camada de implementações superiores e infra
|   ├── controller/    controller de http, queue e etc
|   ├── container/     orquestração de containers
|   |   ├── docker/    orquestração de containers
|   |   ├── kubernate/ orquestração de containers
|   ├── database/      interface do Connection e implementação dos Adapters do banco
|   ├── environment/   carregamento das variáveis via dotenv
|   ├── factory/       implementação das fábricas
|   ├── http/          interface do Http e implementação dos Adapters dos presenters
|   ├── queue/         interface do Queue e implementação dos Adapters da Mensageria
|   ├── repository/    implementação dos repositórios
|   |   ├── database/  implementação dos repositórios de banco
|   |   ├── memory/    implementação dos repositórios de memória
├── presentation/      camada de apresentação dos frameworks
|   ├── presenter/     frameworks de primeiro contato com mundo
|   |   ├── express/   implementação da execução do framework
├── test/              camada dos testes
|   ├── api/           testes de api e rotas
|   ├── integration/   testes de integração em especial usecases
|   ├── mocks/         arquivos de mocks onde é ideal não usar tanto mas cada teste ter seu mock
|   ├── unit/          testes unitários exemplo os de domínio
```

## Clean Architecture e Onion Architecture com DDD

Basicamente será utilizado os conceitos mais importantes do _Clean Archicture_ tais como:

- _Layers_;
- _couplings_;
- _Boundary context_;
- _Dependency rules_.

### Camadas, Dependency rules e Onion Architecture

Como _Clean Architecture_ possui as camadas abaixo:

- _Frameworks & Drivers_ `>`
- _Interface Adapters_ `>`
- _Application Business Rules_ `>`
- _Enterprise Business Rules_

Ao misturar com **DDD** e Onion **_Architecture_** fica uma excelente estrutura tal como:

- _Presentation_ `>`
- _Infra_ `>`
- _Application_ `>`
- _Domain_ `>`

#### Conceitos

- Cada um pode importar os de baixo. Ex: Os arquivos de _Presentation_ pode importar todos;
- Em cada um de baixo **não** pode importar os de cima. Ex: Os arquivos de _Domain_ **só pode importar** dele mesmo (outros _domain_).

### Boundary context

Como `domain` não pode ter importações das demais camadas ele precisa desse conceito. Basicamente são `Interfaces`.

Note os arquivos abaixo para entender melhor.

```
packages/auth/src/domain/factory/RepositoryFactory.ts
packages/auth/src/domain/repository/UserRepository.ts
```

Esses arquivos possuem implementações da camada de `infra` e para não acoplar em `domain` as _interfaces_ entram em cena.

## DDD

### Repository & Aggregates & CQRS

_Repository_ do DDD é o meio de aplicar _Aggregates_. É possível ter _Aggregate_ de 1 _Repository_ e sobre uma tabela ou até mais.

Outro exemplo que _Aggregates_ podem acabar tendo 1 _Repository_ que nele tem uma _query_ como abaixo que trás dados de
outras tabelas.

Quando se quer separar as _queries_ das _mutations_ o conceito de CQRS pode ser aplicado na camada de `application`.

**Exemplo**:

- `packages/<module>/src/application/query/GetOrdersQuery.ts` ou;
- `packages/<module>/src/application/mutation/SaveOrdersItems.ts`;

```ts
import Connection from '../../infra/database/Connection'

export default class GetOrdersQuery {
  constructor(readonly connection: Connection) {}

  execute() {
    return this.connection.query(
      "select code, total, (select array_agg(json_build_object('description', i.description, 'price', oi.price)) from ccca.order_item oi join ccca.item i using (id_item) where oi.id_order = o.id_order) as items from ccca.order o",
      [],
    )
  }
}
```

## Event Driven Architecture

As principais pastas com implementações sobre, são:

```
packages/<module>/application/handler/
packages/<module>/domain/event/
packages/<module>/infra/queue
```

#### Quando é o momento de aplicar o conceito e implementação?

Um exemplo é de quando notar que um `usecase` está quebrando o princípio **SRP** (_Single Responsibility Principle_)
do SOLID.

Quando perceber que o _usecase_ está fazendo algo que não é dele e que poderia delegar para um processamento posterior,
é aí que aplicar `this.queue.publish(orderPlaced)` por exemplo será bem-vindo.

**Obs:** Lembrando que a nomenclatura será sempre do ponto de vista de algo que já aconteceu.

## i18n

Foi aplicado no projeto `pt-BR` como padrão, mas é possível via _header_, _cookie_ e na routa alterar a linguagem de tradução tal como `en`. Veja:

Exemplo via rota: `?lng=en`.

- https://i18next.github.io/i18next/node/pages/doc_express.html

# Container

Nesse projeto estarei usando **Kubernetes** e **Docker** para desenvolver e _deploys_ via algumas das ferramentas. Instale-as para usar, sendo:

- [Kubernetes](#kubernetes)

## Estudos

Após as instalações e caso esteja estudando **K8S** e **Skaffold**, muito provavelmente você passará pelos comandos abaixo.

```sh
kind create cluster # Primeiro levante o cluster do kind para skaffold fazer push da imagem do máquina local
kubectl get nodes # Veja se deu certo
skaffold init # Prepare o ambiente. Escolha: 1) Dockerfile 2) None 3) Enter
skaffold run # Irá buildar e rodar os containers. Se precisar rode novamente
kubectl get pod # Ver os pods
kubectl get svc # Ver os IPs e portas
kubectl get all # Ver todos os pods
kubectl port-forward svc/auth 3001:3001 # Expor a porta do container para sua máquina local
skaffold delete # Deletar o que foi executado na pipeline inicial
skaffold run --port-forward # Irá reconstruir a imagem exportando as portas dos containers para máquina local
skaffold dev --port-forward # Rodar em modo desenvolvimento para exibição dos logs
skaffold debug --port-forward # Rodar em modo desenvolvimento com debug
helm list # Se o Kubernetes executar com Helm este comando irá listar aquilo que ele está trabalhando
kubectl describe pod <container> # Pegue o nome do container em execução via kubectl get pod
```

Outros comandos úteis

```sh
kubectl create deploy products --image=server/auth --dry-run -o yml > auth-definition.yml
```

## Execução via Docker e Compose e ferramentas

Instale-os caso queira rodar o projeto via `make docker_dev` e outros comandos disponíveis no `Makefile`.

- https://docs.docker.com/engine/install/ubuntu/
- https://docs.docker.com/compose/install/

## Execução via Kubernetes e ferramentas

Tem alguns comandos pré disponíveis nos `Makefile` do _root_ ou projeto.

```sh
make bootstrap
make k8s_init
make k8s_common_dev # sempre deve ser rodado num terminal
make k8s_database_create # criar os databases para rodar as migrações
make k8s_dev # ou k8s_debug deve ser rodado em outro terminal
make k8s_run # apenas para deploy (não rodar local)
make k8s_stop # ele deleta os containers mas é assim mesmo que skaffold funciona
make k8s_env # se alterar algum .env precisa rodar esse comando para atualizar
```

### Comandos úteis

```sh
# Ver os containers e seus nomes
kubectl get pods
# Entrar num container
kubectl exec -it <container> -- sh
# Criar configmap a partir do .env
kubectl create configmap server-auth-env --from-env-file=src/infra/environment/.env
# Ver configmap criado
kubectl get configmap server-auth-env -o yaml
# Editar configmap no editar padrão
kubectl edit secrets <container>
# Ver variáveis de ambiente dentro do container
kubectl exec <container> -- printenv
# Para ver os logs
kubectl logs <container>
# Para ver os volumes persistidos
kubectl get pv
# Para ver os volumes
kubectl get pvc
# Ver o IP e Port em que os containers estão rodando
kubectl get endpoints
# Estando dentro do container conseguirá ver o ip interno e porta em execução
netstat -ln
```

### Mais informações sobre volumes

```sh
# Para ter mais informações sobre os volumes configurados nos arquivos k8s/*.yml e etc
kubectl describe pvc server-pgadmin-claim
kubectl get pvc
kubectl describe pv pvc-<uuid>
```

### Scale

```sh
kubectl scale deployment/server-auth --replicas=2;
```

### Dashboard

Para ter o Dashboard do **Kubernetes** faça o seguinte:

```sh
# Configurar dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.5.0/aio/deploy/recommended.yaml
# Ver se kubernetes-dashboard está presente
kubectl get ns
# Ver se está rodando
kubectl -n kubernetes-dashboard get pods -o wide
# Ver outros dados como ip e porta
kubectl -n kubernetes-dashboard get svc
# Altere no final "type: ClusterIP" para "type: LoadBalancer"
kubectl -n kubernetes-dashboard edit svc kubernetes-dashboard
# Caso queira obter informacões do cluster
kubectl cluster-info
# Criar um proxy entre sua máquina e servidor de API do Kubernetes
kubectl proxy
# Acessar a rota abaixo
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/login
# Pegar token para incluir na rota selecionando Token
kubectl -n kubernetes-dashboard create token admin-user
# Para acessos futuros pode acessar via link abaixo
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/workloads?namespace=default
# Se quiser alterar a porta (não recomendo)
kubectl port-forward -n kubernetes-dashboard service/kubernetes-dashboard 8080:443
```

### Postgres

Comandos úteis sobre **Postgres** com **Kubernetes**.

```sh
# Ver os containers para achar o nome do container postgres
kubectl get pods
# Entrar no bash do container do postgres
kubectl exec -it deployment/server-postgres -- sh
# Dentro do container rode para acessar o postgres
psql
# Ou
kubectl exec -it deployment/server-postgres -- psql
# Ou fora do container e caso tenha psql instalado na sua máquina
psql -h localhost -p 5432 -U root -d <db>
# Exemplo de comando postgres para ver os databases
# Mais comandos: https://postgrescheatsheet.com
\l
# Entrar num database para rodar as queries
\c auth
```

### Referências

- [Handling environment variables with Kubernetes](https://humanitec.com/blog/handling-environment-variables-with-kubernetes)
- [StackOverflow - k8s persist volume](https://stackoverflow.com/a/62581280)
- [Kubernetes Dashboard Setup - Deploy Applications using Web UI](https://youtu.be/CICS57XbS9A?t=153)
- [Criar um primeiro usuário para Dashboard do Kubernetes](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md)
- [Tutorial de configuração do postgres no Kubernetes](https://adamtheautomator.com/postgres-to-kubernetes/)
- [Hackear montagem do volume do pgadmin no Kubernetes](https://stackoverflow.com/a/64357035/4731097)

---

### Skaffold

É um gerador de _pipeline_ de desenvolvimento contínuo com **Kubernetes**. Ele gera um boilerplate para facilitar você
fazer _deploys_ especificando qual ambiente gostaria tal como: local, homolog, production.

- [Instalação](https://skaffold.dev/docs/install/#standalone-binary)

---

### Kind

É uma solução para criação de _Cluster_ **Kubernetes** baseado em **Docker**.

- [Instalação](https://kind.sigs.k8s.io/docs/user/quick-start/#installing-with-a-package-manager)

---

### Helm

Gerenciador de pacotes para fazer _setup_ de aplicações no **Kubernetes**.

- [Instalação](https://helm.sh/)

---

### Kubectl

Orquestração de _containers_.

- [Instalação](https://kubernetes.io/docs/tasks/tools/#kubectl)

---

### Cloud Code

Instale a extensão para trabalhar com as ferramentas de _Cloud_ do **Google**. Ele te ajuda a debugar no **Kubernetes**
e possui _intellisense_ para trabalhar com **Skaffold**.

- [Extensão para vscode](https://github.com/GoogleCloudPlatform/cloud-code-vscode)
