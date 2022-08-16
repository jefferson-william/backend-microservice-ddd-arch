import { User } from '../../../../../domain/entity/User'
import { Crypto } from '../../../../../domain/service/Crypto'
import { NotFoundError } from '../../../../../domain/error/NotFoundError'
import { UserMemoryRepository } from '../../../../../infra/repository/memory/UserMemoryRepository'
import i18n from '../../../../../domain/i18n'

describe('UserMemoryRepository', () => {
  describe('should test failure', () => {
    it('should return error when fetching a non-existent user', async () => {
      const userRepository = new UserMemoryRepository(i18n)
      try {
        await userRepository.findByEmail('email@email.com')
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError)
        expect(error).toMatchObject({
          message: 'Usuário não encontrado',
        })
      }
    })
  })

  describe('should test success', () => {
    it('should create and get user', async () => {
      const userRepository = new UserMemoryRepository(i18n)
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
      userRepository.create(user)
      const data = await userRepository.findByEmail(user.email)
      const list = await userRepository.list()
      const count = await userRepository.count()
      expect(data).toMatchObject(user)
      expect(list).toEqual([data])
      expect(count).toEqual(1)
      userRepository.clear()
    })
  })
})
