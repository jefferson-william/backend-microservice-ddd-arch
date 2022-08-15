import { Student } from '../entity/Student'

export interface StudentRepository {
  findByEmail(email: string): Promise<Student>
  create(student: Student): Promise<void>
}
