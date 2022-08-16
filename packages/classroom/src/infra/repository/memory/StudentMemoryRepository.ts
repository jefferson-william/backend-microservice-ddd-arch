import { I18n } from '../../../domain/i18n'
import { NotFoundError } from '../../../domain/error/NotFoundError'
import { Student } from '../../../domain/entity/Student'
import { StudentRepository } from '../../../domain/repository/StudentRepository'

let data: Student[] = []

export class StudentMemoryRepository implements StudentRepository {
  constructor(private readonly i18n: I18n) {}

  async findByEmail(email: string): Promise<Student> {
    const student = data.find((student) => student.email === email)
    if (!student) throw new NotFoundError(this.i18n.t('treatment.student_not_found'))
    return student
  }

  async list(): Promise<Student[]> {
    return data
  }

  async count(): Promise<number> {
    return data.length
  }

  async create(student: Student): Promise<void> {
    data.push(student)
  }

  async clear(): Promise<void> {
    data = []
  }
}
