import { join } from 'path'
import dotenv from 'dotenv'

console.log(0, process.env.NODE_ENV)
console.log(1, __dirname)

if (!['production'].includes(process.env.NODE_ENV as string)) {
  dotenv.config({ path: join(__dirname, '.env') })
}
