import { LoginFactory } from '../../../infra/factory/LoginFactory'
import { httpAdapterFactory } from '../../../infra/factory/HttpAdapterFactory'
import { repositoryFactory } from '../../../infra/factory/RepositoryFactory'
import { HealthFactory } from '../../../infra/factory/HealthFactory'

HealthFactory.runController()
LoginFactory.runController(repositoryFactory)

export const httpExpressAdapterFactory = httpAdapterFactory
