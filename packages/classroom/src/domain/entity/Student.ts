import crypto from 'node:crypto'
import { Entity } from './Entity'

export class Student implements Entity {
  constructor(
    private data: {
      id?: number
      uuid?: string
      name: string
      email: string
    },
    uuid: string | null,
  ) {
    if (!uuid) {
      this.data.uuid = crypto.randomUUID()
    } else {
      this.data.uuid = uuid
    }
  }

  get uuid() {
    return this.data.uuid as string
  }

  get id() {
    return this.data.id
  }

  get name() {
    return this.data.name
  }

  get email() {
    return this.data.email
  }

  toJSON() {
    return this.data
  }
}
