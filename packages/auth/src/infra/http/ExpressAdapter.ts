import path from 'path'
import i18nBackend from 'i18next-fs-backend'
import i18nMiddlware from 'i18next-http-middleware'
import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import i18n from '../../domain/i18n'
import { InternalError } from '../../domain/error/InternalError'
import Http from './Http'

export class ExpressAdapter implements Http {
  private app: any

  constructor() {
    i18n
      .use(i18nBackend)
      .use(i18nMiddlware.LanguageDetector)
      .init({
        fallbackLng: 'pt-br',
        backend: {
          loadPath: path.join(__dirname, '../../locales/{{lng}}/translation.json'),
        },
        preload: ['pt-br'],
      })
    this.app = express()
    this.app.use(i18nMiddlware.handle(i18n))
    this.app.use(express.json())
    this.app.use(function (req: any, res: any, next: any) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      )
      res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
      next()
    })
  }

  on(method: string, url: string, callback: Function): void {
    this.app[method](this.parseUrl(url), async function (req: Request, res: Response) {
      try {
        const data = await callback(req.params, req.body, req.i18n)
        const output = {
          data,
          error: [],
        }
        res.json(output)
      } catch (error) {
        if (error instanceof InternalError) {
          const output = {
            error: [{ message: error.message }],
          }
          res.status(error.code).json(output)
        } else {
          const output = {
            error: [{ message: 'Internal server error' }],
          }
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(output)
        }
      }
    })
  }

  listen(port: number): void {
    this.app.listen(port)
  }

  getApp() {
    return this.app
  }

  private parseUrl(url: string) {
    return url.replace(/\{/g, ':').replace(/\}/g, '')
  }
}
