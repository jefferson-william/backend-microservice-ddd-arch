import { LoginUseCase } from '../../application/usecase/LoginUseCase'
import { LoginController } from '../controller/LoginController'
import { RepositoryFactory } from '../../domain/factory/RepositoryFactory'
import { httpAdapterFactory } from './HttpAdapterFactory'

export class LoginFactory {
  static getUseCase(repositoryFactory: RepositoryFactory) {
    return {
      login: new LoginUseCase(repositoryFactory.createUserRepository()),
    }
  }

  static runController(repositoryFactory: RepositoryFactory) {
    new LoginController(httpAdapterFactory, repositoryFactory)
  }
}
