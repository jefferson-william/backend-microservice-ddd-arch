import '../@types/extend-type'
import '../infra/environment'
import '../infra/database/Migration'
import { Environment } from '../domain/environment'
import { httpExpressAdapterFactory } from './presenter/express'

httpExpressAdapterFactory.listen(Environment.SERVER.PORT)
