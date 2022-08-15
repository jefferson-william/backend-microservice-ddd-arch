import { DomainEvent } from '../../domain/event/DomainEvent'

export interface Queue {
  connect(): Promise<void>
  close(): Promise<void>
  consume(eventName: string, callback: any): Promise<void>
  publish(domainEvent: DomainEvent): Promise<void>
}
