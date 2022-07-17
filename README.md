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
