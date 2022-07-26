# server

Projeto que se tornará grande de estudo com DDD, Clean Architecture, Microservice, TDD, SOLID e Design Patterns.

## Resumo

A ideia de criar um projeto que se tornará grande com tempo com vários `packages` veio para praticar várias
**tecnologias, padrões e arquiteturas**.

Cada _package_ será um _Microservice_ com possibilidade do mundo se conectar via REST, Mensageria (básico) e outros
conforme for possível/priorizada implementação (GraphQL, gRPC, Kafka, HabbitMQ, SQS, SNS e etc).

## Execução

Por enquanto tem apenas um formato como abaixo, mas será possível via `docker-compose` e `kubectl` (Kubernates) com
_reverse proxy_ com _Traefik_.

```bash
make bootstrap
# make dev
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

## Clean Architecture com DDD

Basicamente será utilizado os conceitos mais básicos dele tais como:

- _Layers_;
- _couplings_;
- _Boundary context_;
- _Dependency rules_.

### Camadas e Dependency rules

Como este possui as camadas abaixo:

- _Frameworks & Drivers_ `>`
- _Interface Adapters_ `>`
- _Application Business Rules_ `>`
- _Enterprise Business Rules_

Ao misturar com DDD e para uma excelente estrutura, teremos:

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

_Repository_ do DDD é o meio de aplicar _Aggregates_. É possível ter _Aggregate_ de 1 _Repository_ ou até mais.

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

- https://i18next.github.io/i18next/node/pages/doc_express.html

# Container

Nesse projeto estarei usando **Kubernates** para desenvolver e _deploys_ via algumas das ferramentas abaixo. Instale para usar.

## Execução

Após as instalações abaixo, rode:

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
helm list # Se o Kubernates executar com Helm este comando irá listar aquilo que ele está trabalhando
kubectl describe pod <container> # Pegue o nome do container em execução via kubectl get pod
```

Outros comandos úteis

```sh
kubectl create deploy products --image=server/auth --dry-run -o yml > auth-definition.yml
```

## Kubernates

### Comandos úteis

```sh
# Entrar num container
kubectl exec -it <container> -- /bin/sh
# Criar configmap a partir do .env
kubectl create configmap server-auth-env --from-env-file=src/infra/environment/.env
# Ver configmap criado
kubectl get configmap server-auth-env -o yaml
# Editar configmap no editar padrão
kubectl edit secrets server-auth-dev
# Ver variáveis de ambiente dentro do container
kubectl exec server-auth -- printenv
```

### Referências

- https://humanitec.com/blog/handling-environment-variables-with-kubernetes

---

### Skaffold

É um gerador de _pipeline_ de desenvolvimento contínuo com **Kubernates**. Ele gera um boilerplate para facilitar você
fazer _deploys_ especificando qual ambiente gostaria tal como: local, homolog, production.

- [Instalação](https://skaffold.dev/docs/install/#standalone-binary)

---

### Kind

É uma solução para criação de _Cluster_ **Kubernates** baseado em **Docker**.

- [Instalação](https://kind.sigs.k8s.io/docs/user/quick-start/#installing-with-a-package-manager)

---

### Helm

Gerenciador de pacotes para fazer _setup_ de aplicações no **Kubernates**.

- [Instalação](https://helm.sh/)

---

### Kubectl

Orquestração de _containers_.

- [Instalação](https://kubernetes.io/docs/tasks/tools/#kubectl)

---

### Cloud Code

Instale a extensão para trabalhar com as ferramentas de _Cloud_ do **Google**. Ele te ajuda a debugar no **Kubernates**
e possui _intellisense_ para trabalhar com **Skaffold**.

- [Extensão para vscode](https://github.com/GoogleCloudPlatform/cloud-code-vscode)
