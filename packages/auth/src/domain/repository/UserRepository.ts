import { User } from '../../domain/entity/User'

export interface UserRepository {
  findByEmail(email: string): Promise<User>
  list(): Promise<User[]>
  count(): Promise<number>
  save(user: User): Promise<void>
  clear(): Promise<void>
}
