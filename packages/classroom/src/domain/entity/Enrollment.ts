import crypto from 'node:crypto'
import { Entity } from './Entity'

export class Enrollment implements Entity {
  constructor(
    private data: {
      id?: number
      uuid?: string
      studentId: number
      courseId: number
      purchasesEnrolledByPurchaseId: number
      inactivatedAt?: Date
      createdAt: Date
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

  get studentId() {
    return this.data.studentId
  }

  get courseId() {
    return this.data.courseId
  }

  get inactivatedAt() {
    return this.data.inactivatedAt
  }

  get purchasesEnrolledByPurchaseId() {
    return this.data.purchasesEnrolledByPurchaseId
  }

  get createdAt() {
    return this.data.createdAt
  }

  toJSON() {
    return this.data
  }
}
