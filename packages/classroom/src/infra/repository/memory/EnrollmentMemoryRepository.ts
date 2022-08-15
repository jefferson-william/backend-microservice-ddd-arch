import { Enrollment } from '../../../domain/entity/Enrollment'
import { EnrollmentRepository } from '../../../domain/repository/EnrollmentRepository'

let data: Enrollment[] = []

export class EnrollmentMemoryRepository implements EnrollmentRepository {
  constructor() {}

  async create(enrollment: Enrollment): Promise<void> {
    data.push(enrollment)
  }
}
