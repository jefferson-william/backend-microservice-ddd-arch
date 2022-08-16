import { Enrollment } from '../../../domain/entity/Enrollment'
import { EnrollmentRepository } from '../../../domain/repository/EnrollmentRepository'
import { Environment } from '../../../domain/environment'
import { I18n } from '../../../domain/i18n'
import { Connection } from '../../database/Connection'

export class EnrollmentDatabaseRepository implements EnrollmentRepository {
  private table = `${Environment.DB_RELATIONAL.POSTGRES.SCHEMA}.enrollment`

  constructor(private readonly connection: Connection, private readonly i18n: I18n) {}

  async list(): Promise<Enrollment[]> {
    const users: Enrollment[] = await this.connection.query(
      `SELECT * FROM ${this.table} LIMIT 100`,
      [],
    )
    return users.map((user) => this.getEnrollmentInstanced(user))
  }

  async count(): Promise<number> {
    const [count] = await this.connection.query(`SELECT COUNT(id)::int FROM ${this.table}`, [])
    return count
  }

  async create(data: Enrollment): Promise<void> {
    await this.connection.query(
      `INSERT INTO ${this.table} (uuid, studentId, courseId, purchasesEnrolledByPurchaseId, inactivatedAt, createdAt) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        data.uuid,
        data.studentId,
        data.courseId,
        data.purchasesEnrolledByPurchaseId,
        data.inactivatedAt,
        data.createdAt,
      ],
    )
  }

  async clear(): Promise<void> {
    if (!Environment.SERVER.NOT_PRODUCTION) return
    await this.connection.query(`DELETE FROM ${this.table}`, [])
  }

  private getEnrollmentInstanced(data: Enrollment) {
    return new Enrollment(
      {
        id: data.id,
        studentId: data.studentId,
        courseId: data.courseId,
        purchasesEnrolledByPurchaseId: data.purchasesEnrolledByPurchaseId,
        inactivatedAt: data.inactivatedAt,
        createdAt: data.createdAt,
      },
      data.uuid as string,
    )
  }
}
