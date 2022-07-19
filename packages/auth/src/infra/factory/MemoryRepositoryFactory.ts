import { RepositoryFactory } from '../../domain/factory/RepositoryFactory'
import { I18n } from '../../domain/i18n'
import { UserRepository } from '../../domain/repository/UserRepository'
import { UserMemoryRepository } from '../repository/memory/UserMemoryRepository'

class MemoryRepositoryFactory implements RepositoryFactory {
  createUserRepository(i18n: I18n): UserRepository {
    return new UserMemoryRepository(i18n)
  }
}

export const memoryRepositoryFactory = new MemoryRepositoryFactory()
