import { I18n } from '../../domain/i18n'
import Http from '../http/Http'

export class HealthController {
  constructor(readonly http: Http) {
    http.on('get', '/health', async function (params: any, body: any, i18n: I18n) {
      return i18n.t('generic.server_is_ok')
    })
  }
}
