import { Student } from '../entity/Student'

export interface StudentRepository {
  findByEmail(email: string): Promise<Student>
  list(): Promise<Student[]>
  count(): Promise<number>
  create(user: Student): Promise<void>
  clear(): Promise<void>
}
