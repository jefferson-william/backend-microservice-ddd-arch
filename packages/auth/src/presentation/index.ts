import '../@types/extend-type'
import '../infra/environment'
import { Environment } from '../domain/environment'
import { httpExpressAdapterFactory } from './presenter/express'

httpExpressAdapterFactory.listen(Environment.SERVER.PORT)
