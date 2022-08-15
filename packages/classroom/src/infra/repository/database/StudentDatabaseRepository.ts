import { NotFoundError } from '../../../domain/error/NotFoundError'
import { Student } from '../../../domain/entity/Student'
import { StudentRepository } from '../../../domain/repository/StudentRepository'
import { Environment } from '../../../domain/environment'
import { I18n } from '../../../domain/i18n'
import { Connection } from '../../database/Connection'

export class StudentDatabaseRepository implements StudentRepository {
  private table = `${Environment.DB_RELATIONAL.POSTGRES.SCHEMA}.student`

  constructor(private readonly connection: Connection, private readonly i18n: I18n) {}

  async findByEmail(email: string): Promise<Student> {
    const [student] = await this.connection.query(`SELECT * FROM ${this.table} WHERE email = $1`, [
      email,
    ])
    if (!student) throw new NotFoundError(this.i18n.t('treatment.student_not_found'))
    return this.getUserInstanced(student)
  }

  async create(data: Student): Promise<void> {
    await this.connection.query(
      `INSERT INTO ${this.table} (uuid, name, email) VALUES ($1, $2, $3)`,
      [data.uuid, data.name, data.email],
    )
  }

  async clear(): Promise<void> {
    if (!Environment.SERVER.NOT_PRODUCTION) return
    await this.connection.query(`DELETE FROM ${this.table}`, [])
  }

  private getUserInstanced(data: Student) {
    return new Student(
      {
        id: data.id,
        name: data.name,
        email: data.email,
      },
      data.uuid as string,
    )
  }
}
