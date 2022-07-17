import { NotFoundError } from '../../../domain/error/NotFoundError'
import { User } from '../../../domain/entity/User'
import { UserRepository } from '../../../domain/repository/UserRepository'
import { Environment } from '../../../domain/environment'
import { Connection } from '../../database/Connection'

export class UserDatabaseRepository implements UserRepository {
  private table = `${Environment.DB_RELATIONAL.POSTGRES.SCHEMA}.user`

  constructor(private readonly connection: Connection) {}

  async findByEmail(email: string): Promise<User> {
    const [user] = await this.connection.query(`SELECT * FROM ${this.table} WHERE email = $1`, [
      email,
    ])
    if (!user) throw new NotFoundError('User not found')
    return new User(
      {
        id: user.id,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        uuid: user.uuid,
        middleName: user.middleName,
      },
      user.uuid,
    )
  }

  async save(user: User): Promise<void> {
    await this.connection.query(
      `INSERT INTO ${this.table} (email, password, firstName, lastName, uuid, middleName) VALUES ($1, $2, $3, $4, $5, $6)`,
      [user.email, user.password, user.firstName, user.lastName, user.uuid, user.middleName],
    )
  }

  async clear(): Promise<void> {
    await this.connection.query(`DELETE FROM ${this.table}`, [])
  }
}
