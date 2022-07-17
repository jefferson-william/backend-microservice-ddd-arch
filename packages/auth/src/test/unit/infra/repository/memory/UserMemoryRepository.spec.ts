import { User } from '../../../../../domain/entity/User'
import { Crypto } from '../../../../../domain/service/Crypto'
import { NotFoundError } from '../../../../../domain/error/NotFoundError'
import { UserMemoryRepository } from '../../../../../infra/repository/memory/UserMemoryRepository'

describe('UserMemoryRepository', () => {
  describe('should test failure', () => {
    test('should return error when fetching a non-existent user', async () => {
      const userRepository = new UserMemoryRepository()
      try {
        await userRepository.findByEmail('email@email.com')
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError)
        expect(error).toMatchObject({
          message: 'User not found',
        })
      }
    })
  })

  describe('should test success', () => {
    test('should save and get user', async () => {
      const userRepository = new UserMemoryRepository()
      const passwordHash = await Crypto.encrypt('123456')
      const user = new User(
        {
          id: 1,
          email: 'email@email.com',
          password: passwordHash,
          firstName: 'Nome',
          lastName: 'Sobrenome',
          middleName: 'Meio',
        },
        null,
      )
      userRepository.save(user)
      const data = await userRepository.findByEmail(user.email)
      expect(data).toMatchObject(user)
      userRepository.clear()
    })
  })
})
