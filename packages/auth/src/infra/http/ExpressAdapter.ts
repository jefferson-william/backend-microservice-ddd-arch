import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { InternalError } from '../../domain/error/InternalError'
import Http from './Http'

export class ExpressAdapter implements Http {
  private app: any

  constructor() {
    this.app = express()
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
        const output = await callback(req.params, req.body)
        res.json(output)
      } catch (error) {
        if (error instanceof InternalError) {
          res.status(error.code).json(error.message)
        } else {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
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
