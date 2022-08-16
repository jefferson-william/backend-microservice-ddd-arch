import { Enrollment } from '../entity/Enrollment'

export interface EnrollmentRepository {
  list(): Promise<Enrollment[]>
  count(): Promise<number>
  create(enrollment: Enrollment): Promise<void>
  clear(): Promise<void>
}
