import { RepositoryFactory } from '../../domain/factory/RepositoryFactory'
import { I18n } from '../../domain/i18n'
import { UserRepository } from '../../domain/repository/UserRepository'
import { Connection } from '../database/Connection'
import { UserDatabaseRepository } from '../repository/database/UserDatabaseRepository'
import { pgPromiseConnectionAdapterFactory } from './PgPromiseConnectionAdapterFactory'

export class DatabaseRepositoryFactory implements RepositoryFactory {
  constructor(readonly connection: Connection) {}

  createUserRepository(i18n: I18n): UserRepository {
    return new UserDatabaseRepository(this.connection, i18n)
  }
}

export const databaseRepositoryFactory = new DatabaseRepositoryFactory(
  pgPromiseConnectionAdapterFactory,
)
