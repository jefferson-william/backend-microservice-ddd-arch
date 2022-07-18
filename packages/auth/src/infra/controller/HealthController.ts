import i18n from '../../domain/i18n'
import Http from '../http/Http'

export class HealthController {
  constructor(readonly http: Http) {
    http.on('get', '/health', async function () {
      return i18n.t('generic.ok')
    })
  }
}
