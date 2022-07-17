import * as bcrypt from 'bcrypt'
import { Environment } from '../environment'

export class Crypto {
  static async encrypt(text: string) {
    const salt = await bcrypt.genSalt(Environment.CRYPTO.ALGORITHM)
    return await bcrypt.hash(text, salt)
  }

  static async compare(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
  }
}
