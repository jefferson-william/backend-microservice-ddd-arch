import { LoginFactory } from '../../../infra/factory/LoginFactory'
import { httpAdapterFactory } from '../../../infra/factory/HttpAdapterFactory'
import { repositoryFactory } from '../../../infra/factory/RepositoryFactory'
import { HealthFactory } from '../../../infra/factory/HealthFactory'
import { Environment } from '../../../domain/environment'

HealthFactory.runController()
LoginFactory.runController(repositoryFactory)

httpAdapterFactory.listen(Environment.SERVER.PORT)

export { httpAdapterFactory }
