import { Kafka, Consumer, Producer } from 'kafkajs'
import { Environment } from '../../domain/environment'
import { InternalError } from '../../domain/error/InternalError'
import { DomainEvent } from '../../domain/event/DomainEvent'
import { Queue } from './Queue'

export class KafkaAdapter implements Queue {
  private kafka: Kafka
  private producer: Producer | undefined
  private consumer: Consumer | undefined
  private mapping = new Map()

  constructor() {
    if (!process.env.KAFKA_BROKER) {
      throw new InternalError('Kafka broker address not set!')
    }
    const config: any = {
      ...(process.env.KAFKA_USER
        ? {
            sasl: {
              mechanism: 'scram-sha-256',
              username: process.env.KAFKA_USER ?? '',
              password: process.env.KAFKA_PASS ?? '',
            },
            ssl: process.env.KAFKA_SSL,
          }
        : {}),
    }
    this.kafka = new Kafka({
      clientId: Environment.MESSAGING.NAME,
      brokers: [process.env.KAFKA_BROKER],
      ...config,
    })
    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
    })
  }

  async connect(): Promise<void> {
    this.consumer = this.kafka.consumer({
      groupId: Environment.MESSAGING.NAME,
      allowAutoTopicCreation: true,
    })
    await this.consumer.connect()
    await this.consumer.run({
      eachMessage: async (payload) => {
        const callback = this.mapping.get(payload.topic)
        callback(payload.message)
      },
    })
  }

  async close(): Promise<void> {
    if (!this.consumer) throw new InternalError('Consumer not instanced')
    await this.consumer.disconnect()
  }

  async consume(eventName: string, callback: any): Promise<void> {
    this.mapping.set(eventName, callback)
  }

  async publish(domainEvent: DomainEvent): Promise<void> {
    if (!this.producer) throw new InternalError('Producer not instanced')
    await this.producer.send({
      topic: domainEvent.name,
      messages: [{ value: JSON.stringify(domainEvent) }],
    })
  }
}
