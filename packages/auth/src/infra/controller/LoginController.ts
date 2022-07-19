import { RepositoryFactory } from '../../domain/factory/RepositoryFactory'
import { I18n } from '../../domain/i18n'
import { LoginFactory } from '../factory/LoginFactory'
import Http from '../http/Http'

export class LoginController {
  constructor(readonly http: Http, readonly repositoryFactory: RepositoryFactory) {
    http.on('post', '/login', async function (params: any, body: any, i18n: I18n) {
      const data = await LoginFactory.getUseCase(repositoryFactory, i18n).login.execute(body)
      return data
    })
  }
}
