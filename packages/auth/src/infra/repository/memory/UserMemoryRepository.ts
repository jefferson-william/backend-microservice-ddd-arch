import { I18n } from '../../../domain/i18n'
import { NotFoundError } from '../../../domain/error/NotFoundError'
import { User } from '../../../domain/entity/User'
import { UserRepository } from '../../../domain/repository/UserRepository'

let data: User[] = []

export class UserMemoryRepository implements UserRepository {
  constructor(private readonly i18n: I18n) {}

  async findByEmail(email: string): Promise<User> {
    const user = data.find((user) => user.email === email)
    if (!user) throw new NotFoundError(this.i18n.t('treatment.user_not_found'))
    return user
  }

  async list(): Promise<User[]> {
    return data
  }

  async count(): Promise<number> {
    return data.length
  }

  async save(user: User): Promise<void> {
    data.push(user)
  }

  async clear(): Promise<void> {
    data = []
  }
}
