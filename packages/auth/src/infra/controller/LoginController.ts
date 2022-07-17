import { RepositoryFactory } from '../../domain/factory/RepositoryFactory'
import { LoginFactory } from '../factory/LoginFactory'
import Http from '../http/Http'

export class LoginController {
  constructor(readonly http: Http, readonly repositoryFactory: RepositoryFactory) {
    http.on('post', '/login', async function (params: any, body: any) {
      const data = await LoginFactory.getUseCase(repositoryFactory).login.execute(body)
      return data
    })
  }
}
