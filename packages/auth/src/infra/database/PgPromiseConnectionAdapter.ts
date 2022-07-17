import pgp from 'pg-promise'
import { Connection } from './Connection'
import { Environment } from '../../domain/environment'

export class PgPromiseConnectionAdapter implements Connection {
  pgp: any

  constructor() {
    this.pgp = pgp()(Environment.DB_RELATIONAL.POSTGRES.URL)
  }

  query(statement: string, params: any): Promise<any> {
    return this.pgp.query(statement, params)
  }

  close(): Promise<void> {
    return this.pgp.$pool.end()
  }
}
