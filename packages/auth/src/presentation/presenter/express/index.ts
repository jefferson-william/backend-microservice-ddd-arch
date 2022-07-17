import { LoginFactory } from '../../../infra/factory/LoginFactory'
import { httpAdapterFactory } from '../../../infra/factory/HttpAdapterFactory'
import { repositoryFactory } from '../../../infra/factory/RepositoryFactory'

LoginFactory.runController(repositoryFactory)

httpAdapterFactory.listen(3001)

export { httpAdapterFactory }
