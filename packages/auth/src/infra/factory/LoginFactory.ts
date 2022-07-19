import { LoginUseCase } from '../../application/usecase/LoginUseCase'
import { LoginController } from '../controller/LoginController'
import { RepositoryFactory } from '../../domain/factory/RepositoryFactory'
import { httpAdapterFactory } from './HttpAdapterFactory'
import { I18n } from '../../domain/i18n'

export class LoginFactory {
  static getUseCase(repositoryFactory: RepositoryFactory, i18n: I18n) {
    return {
      login: new LoginUseCase(repositoryFactory.createUserRepository(i18n), i18n),
    }
  }

  static runController(repositoryFactory: RepositoryFactory) {
    new LoginController(httpAdapterFactory, repositoryFactory)
  }
}
