import { Enrollment } from '../entity/Enrollment'

export interface EnrollmentRepository {
  create(enrollment: Enrollment): Promise<void>
}
