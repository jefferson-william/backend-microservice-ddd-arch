import { NotFoundError } from '../../../domain/error/NotFoundError'
import { User } from '../../../domain/entity/User'
import { UserRepository } from '../../../domain/repository/UserRepository'

let data: User[] = []

export class UserMemoryRepository implements UserRepository {
  constructor() {}

  async findByEmail(email: string): Promise<User> {
    const user = data.find((user) => user.email === email)
    if (!user) throw new NotFoundError('User not found')
    return user
  }

  async save(user: User): Promise<void> {
    data.push(user)
  }

  async clear(): Promise<void> {
    data = []
  }
}
