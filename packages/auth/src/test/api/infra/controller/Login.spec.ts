import requester, { StatusCodes, repositoryFactory } from '../../../mocks/Requester'
import { User } from '../../../../domain/entity/User'
import { Crypto } from '../../../../domain/service/Crypto'

describe('/login', () => {
  describe('should test failure', () => {
    it('should not be able to login for not informing the data', async () => {
      const response = await requester.post('/login')
      expect(response).toMatchObject(
        expect.objectContaining({
          status: StatusCodes.BAD_REQUEST,
        }),
      )
    })

    it('should return user not found error', async () => {
      const response = await requester.post('/login').send({
        email: 'test@email.com',
        password: '123456',
      })
      expect(response).toMatchObject(
        expect.objectContaining({
          status: StatusCodes.NOT_FOUND,
          text: '{"error":[{"message":"User not found"}]}',
        }),
      )
    })

    it('should return unauthorized by wrong password', async () => {
      const passwordHash = await Crypto.encrypt('123456')
      const userRepository = repositoryFactory.createUserRepository()
      userRepository.save(
        new User(
          {
            id: 1,
            email: 'email@email.com',
            password: passwordHash,
            firstName: 'Nome',
            lastName: 'Sobrenome',
            middleName: 'Meio',
          },
          null,
        ),
      )
      const response = await requester.post('/login').send({
        email: 'email@email.com',
        password: 'abcdef',
      })
      expect(response).toMatchObject(
        expect.objectContaining({
          status: StatusCodes.UNAUTHORIZED,
          text: '{"error":[{"message":"Invalid password"}]}',
        }),
      )
      userRepository.clear()
    })
  })

  describe('should test success', () => {
    it('must return the token for the data is correct', async () => {
      const passwordHash = await Crypto.encrypt('123456')
      const userRepository = repositoryFactory.createUserRepository()
      userRepository.save(
        new User(
          {
            id: 1,
            email: 'email@email.com',
            password: passwordHash,
            firstName: 'Nome',
            lastName: 'Sobrenome',
            middleName: 'Meio',
          },
          null,
        ),
      )
      const response = await requester.post('/login').send({
        email: 'email@email.com',
        password: '123456',
      })
      expect(response.body).toHaveProperty('token')
      userRepository.clear()
    })
  })
})
