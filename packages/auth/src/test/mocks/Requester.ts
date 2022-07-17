import test from 'supertest'
import { httpAdapterFactory } from '../../infra/factory/HttpAdapterFactory'

const requester = test(httpAdapterFactory.getApp())

export type Requester = typeof requester

export { StatusCodes } from 'http-status-codes'
export { repositoryFactory } from '../../infra/factory/RepositoryFactory'

export default requester
