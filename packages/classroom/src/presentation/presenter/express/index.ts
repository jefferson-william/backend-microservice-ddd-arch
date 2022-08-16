import { httpAdapterFactory } from '../../../infra/factory/HttpAdapterFactory'
import { HealthFactory } from '../../../infra/factory/HealthFactory'

HealthFactory.runController()

export const httpExpressAdapterFactory = httpAdapterFactory
