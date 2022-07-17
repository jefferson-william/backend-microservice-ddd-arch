import { RepositoryFactory } from '../../domain/factory/RepositoryFactory'
import { UserRepository } from '../../domain/repository/UserRepository'
import { Connection } from '../database/Connection'
import { UserDatabaseRepository } from '../repository/database/UserDatabaseRepository'
import { pgPromiseConnectionAdapterFactory } from './PgPromiseConnectionAdapterFactory'

class DatabaseRepositoryFactory implements RepositoryFactory {
  constructor(private readonly connection: Connection) {}

  createUserRepository(): UserRepository {
    return new UserDatabaseRepository(this.connection)
  }
}

export const databaseRepositoryFactory = new DatabaseRepositoryFactory(
  pgPromiseConnectionAdapterFactory,
)
