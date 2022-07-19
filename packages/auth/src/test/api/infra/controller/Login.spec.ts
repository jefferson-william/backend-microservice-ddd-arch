import requester, { StatusCodes, repositoryFactory, i18n } from '../../../mocks'
import { User } from '../../../../domain/entity/User'
import { Crypto } from '../../../../domain/service/Crypto'

describe('/login', () => {
  beforeAll(async () => {
    await i18n.start()
  })

  describe('should test failure', () => {
    it('should not be able to login for not informing the data', async () => {
      const response = await requester.post('/login')
      expect(response).toMatchObject(
        expect.objectContaining({
          status: StatusCodes.BAD_REQUEST,
          text: '{"error":[{"message":"Dados faltando"}]}',
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
          text: '{"error":[{"message":"Usuário não encontrado"}]}',
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
          text: '{"error":[{"message":"Senha incorreta"}]}',
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
      expect(response.body).toMatchObject({
        error: [],
        data: {
          token: '',
        },
      })
      userRepository.clear()
    })
  })
})
