import { NotFoundError } from '../../../domain/error/NotFoundError'
import { User } from '../../../domain/entity/User'
import { UserRepository } from '../../../domain/repository/UserRepository'
import { Environment } from '../../../domain/environment'
import { I18n } from '../../../domain/i18n'
import { Connection } from '../../database/Connection'

export class UserDatabaseRepository implements UserRepository {
  private table = `${Environment.DB_RELATIONAL.POSTGRES.SCHEMA}.user`

  constructor(private readonly connection: Connection, private readonly i18n: I18n) {}

  async findByEmail(email: string): Promise<User> {
    const [user] = await this.connection.query(`SELECT * FROM ${this.table} WHERE email = $1`, [
      email,
    ])
    if (!user) throw new NotFoundError(this.i18n.t('treatment.user_not_found'))
    return this.getUserInstanced(user)
  }

  async list(): Promise<User[]> {
    const users: User[] = await this.connection.query(`SELECT * FROM ${this.table} LIMIT 100`, [])
    return users.map((user) => this.getUserInstanced(user))
  }

  async count(): Promise<number> {
    const [count] = await this.connection.query(`SELECT COUNT(id)::int FROM ${this.table}`, [])
    return count
  }

  async create(user: User): Promise<void> {
    await this.connection.query(
      `INSERT INTO ${this.table} (email, password, firstName, lastName, uuid, middleName) VALUES ($1, $2, $3, $4, $5, $6)`,
      [user.email, user.password, user.firstName, user.lastName, user.uuid, user.middleName],
    )
  }

  async clear(): Promise<void> {
    if (!Environment.SERVER.NOT_PRODUCTION) return
    await this.connection.query(`DELETE FROM ${this.table}`, [])
  }

  private getUserInstanced(userData: User) {
    return new User(
      {
        id: userData.id,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        uuid: userData.uuid,
        middleName: userData.middleName,
      },
      userData.uuid as string,
    )
  }
}
