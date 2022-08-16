import { NotFoundError } from '../../../domain/error/NotFoundError'
import { Course } from '../../../domain/entity/Course'
import { CourseRepository } from '../../../domain/repository/CourseRepository'
import { Environment } from '../../../domain/environment'
import { I18n } from '../../../domain/i18n'
import { Connection } from '../../database/Connection'

export class CourseDatabaseRepository implements CourseRepository {
  private table = `${Environment.DB_RELATIONAL.POSTGRES.SCHEMA}.course`

  constructor(private readonly connection: Connection, private readonly i18n: I18n) {}

  async findByPurchasesProductId(purchasesProductId: number): Promise<Course> {
    const [course] = await this.connection.query(
      `SELECT * FROM ${this.table} WHERE purchasesProductId = $1`,
      [purchasesProductId],
    )
    if (!course) throw new NotFoundError(this.i18n.t('treatment.course_not_found'))
    return this.getCourseInstanced(course)
  }

  async list(): Promise<Course[]> {
    const users: Course[] = await this.connection.query(`SELECT * FROM ${this.table} LIMIT 100`, [])
    return users.map((user) => this.getCourseInstanced(user))
  }

  async count(): Promise<number> {
    const [count] = await this.connection.query(`SELECT COUNT(id)::int FROM ${this.table}`, [])
    return count
  }

  async create(data: Course): Promise<void> {
    await this.connection.query(
      `INSERT INTO ${this.table} (uuid, title, purchasesProductId) VALUES ($1, $2, $3)`,
      [data.uuid, data.title, data.purchasesProductId],
    )
  }

  async clear(): Promise<void> {
    if (!Environment.SERVER.NOT_PRODUCTION) return
    await this.connection.query(`DELETE FROM ${this.table}`, [])
  }

  private getCourseInstanced(data: Course) {
    return new Course(
      {
        id: data.id,
        title: data.title,
        purchasesProductId: data.purchasesProductId,
      },
      data.uuid as string,
    )
  }
}
