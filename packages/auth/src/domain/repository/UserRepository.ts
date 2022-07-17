import { User } from '../../domain/entity/User'

export interface UserRepository {
  findByEmail(email: string): Promise<User>
  save(user: User): Promise<void>
  clear(): Promise<void>
}
