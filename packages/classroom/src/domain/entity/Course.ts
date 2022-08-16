import crypto from 'node:crypto'
import { Entity } from './Entity'

export class Course implements Entity {
  constructor(
    private data: {
      id?: number
      uuid?: string
      title: string
      purchasesProductId: number
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

  get title() {
    return this.data.title
  }

  get purchasesProductId() {
    return this.data.purchasesProductId
  }

  toJSON() {
    return this.data
  }
}
