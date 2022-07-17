import env from 'env-var'

export class Environment {
  static readonly SERVER = Object.freeze({
    PORT: env.get('PORT').required().asPortNumber(),
    NODE_ENV: env.get('NODE_ENV').required().asString(),
    APP_ENV: env.get('APP_ENV').required().asString(),
    NOT_PRODUCTION: process.env.NODE_ENV !== 'production',
  })
  static readonly DB_RELATIONAL = Object.freeze({
    POSTGRES: {
      HOST_AUTH_METHOD: env.get('POSTGRES_HOST_AUTH_METHOD').required().asString(),
      PORT: env.get('POSTGRES_PORT').required().asPortNumber(),
      HOST: env.get('POSTGRES_HOST').required().asString(),
      USER: env.get('POSTGRES_USER').required().asString(),
      PASSWORD: env.get('POSTGRES_PASSWORD').required().asString(),
      SCHEMA: env.get('POSTGRES_SCHEMA').required().asString(),
      DATABASE: env.get('POSTGRES_DATABASE').required().asString(),
      URL: env.get('POSTGRES_URL').required().asString(),
    },
  })
  static readonly CRYPTO = Object.freeze({
    ALGORITHM: env.get('CRYPTO_ALGORITHM').required().asInt(),
    PASSWORD: env.get('CRYPTO_PASSWORD').required().asString(),
  })
  static readonly MESSAGING = Object.freeze({
    KAFKA: {
      KAFKA_CFG_ZOOKEEPER_CONNECT: env.get('KAFKA_CFG_ZOOKEEPER_CONNECT').required().asString(),
      KAFKA_ADVERTISED_LISTENERS: env.get('KAFKA_ADVERTISED_LISTENERS').required().asString(),
      KAFKA_CFG_OFFSETS_TOPIC_REPLICATION_FACTOR: env
        .get('KAFKA_CFG_OFFSETS_TOPIC_REPLICATION_FACTOR')
        .required()
        .asString(),
    },
  })
}
