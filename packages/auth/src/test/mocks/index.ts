import supertest from 'supertest'
import { httpAdapterFactory } from '../../infra/factory/HttpAdapterFactory'

export const app = httpAdapterFactory.getApp()

export const requester = supertest(app)

export class i18next {
  static async start() {
    await requester.get('/health')
  }
}

export { StatusCodes } from 'http-status-codes'
export { default as supertest } from 'supertest'
export { repositoryFactory } from '../../infra/factory/RepositoryFactory'
