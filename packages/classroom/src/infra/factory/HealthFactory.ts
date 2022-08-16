import { HealthController } from '../controller/HealthController'
import { httpAdapterFactory } from './HttpAdapterFactory'

export class HealthFactory {
  static runController() {
    new HealthController(httpAdapterFactory)
  }
}
