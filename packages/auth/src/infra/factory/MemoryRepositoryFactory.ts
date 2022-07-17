import { RepositoryFactory } from '../../domain/factory/RepositoryFactory'
import { UserRepository } from '../../domain/repository/UserRepository'
import { UserMemoryRepository } from '../repository/memory/UserMemoryRepository'

class MemoryRepositoryFactory implements RepositoryFactory {
  createUserRepository(): UserRepository {
    return new UserMemoryRepository()
  }
}

export const memoryRepositoryFactory = new MemoryRepositoryFactory()
