import { join } from 'path'
import { Environment } from '../../domain/environment'
import { migrate } from 'postgres-migrations'

const { DATABASE, USER, PASSWORD, HOST, PORT } = Environment.DB_RELATIONAL.POSTGRES

const dbConfig = {
  database: DATABASE,
  user: USER,
  password: PASSWORD,
  host: HOST,
  port: PORT,
  ensureDatabaseExists: true,
  defaultDatabase: DATABASE,
}

migrate(dbConfig, join(__dirname, '../migration'))
  .then(() => {
    console.info('Migration success')
  })
  .catch((error) => {
    console.error('Migration error', error)
  })
