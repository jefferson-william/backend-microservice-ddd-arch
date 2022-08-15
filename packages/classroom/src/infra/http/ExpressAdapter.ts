import i18next from 'i18next'
import i18nMiddlware from 'i18next-http-middleware'
import express, { Express, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as i18n from '../../domain/i18n'
import { InternalError } from '../../domain/error/InternalError'
import Http from './Http'

export class ExpressAdapter implements Http {
  private app: Express

  constructor() {
    i18n.init()
    this.app = express()
    this.app.use(i18nMiddlware.handle(i18next))
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
            error: [{ message: req.i18n.t('error.internal_server_error') }],
          }
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(output)
        }
      }
    })
  }

  listen(port: number) {
    return this.app.listen(port)
  }

  getApp() {
    return this.app
  }

  private parseUrl(url: string) {
    return url.replace(/\{/g, ':').replace(/\}/g, '')
  }
}
