import { join } from 'path'
import { readdirSync, lstatSync } from 'fs'
import i18nBackend from 'i18next-fs-backend'
import i18nMiddleware from 'i18next-http-middleware'
import i18next, { i18n as i18nInterface } from 'i18next'

export interface I18n extends i18nInterface {}

const i18n = i18next

export const init = async () => {
  const localesFolder = join(__dirname, '../../locales')

  const promise = i18n
    .use(i18nBackend)
    .use(i18nMiddleware.LanguageDetector)
    .init({
      fallbackLng: 'pt-br',
      backend: {
        loadPath: join(__dirname, '../../locales/{{lng}}/translation.json'),
      },
      preload: readdirSync(localesFolder).filter((fileName) => {
        const joinedPath = join(localesFolder, fileName)
        return lstatSync(joinedPath).isDirectory()
      }),
    })
  return promise
}

export default i18n
