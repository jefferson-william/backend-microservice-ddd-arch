import { join } from 'path'
import dotenv from 'dotenv'

if (!['production'].includes(process.env.NODE_ENV as string)) {
  dotenv.config({ path: join(__dirname, '.env') })
}
