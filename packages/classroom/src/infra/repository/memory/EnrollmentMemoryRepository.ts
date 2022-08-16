import { Enrollment } from '../../../domain/entity/Enrollment'
import { EnrollmentRepository } from '../../../domain/repository/EnrollmentRepository'

let data: Enrollment[] = []

export class EnrollmentMemoryRepository implements EnrollmentRepository {
  constructor() {}

  async list(): Promise<Enrollment[]> {
    return data
  }

  async count(): Promise<number> {
    return data.length
  }

  async create(enrollment: Enrollment): Promise<void> {
    data.push(enrollment)
  }

  async clear(): Promise<void> {
    data = []
  }
}
