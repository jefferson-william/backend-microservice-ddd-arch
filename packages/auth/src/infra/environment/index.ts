import dotenv from 'dotenv'

if (['development', 'test'].includes(process.env.NODE_ENV as string)) {
  dotenv.config()
}
