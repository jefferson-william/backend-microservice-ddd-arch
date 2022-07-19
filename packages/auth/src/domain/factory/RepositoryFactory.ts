import { I18n } from '../i18n'
import { UserRepository } from '../repository/UserRepository'

export interface RepositoryFactory {
  createUserRepository(i18n: I18n): UserRepository
}
