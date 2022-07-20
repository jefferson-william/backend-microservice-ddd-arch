import { i18next, StatusCodes, repositoryFactory, requester } from '../../../mocks'
import i18n from '../../../../domain/i18n'
import { User } from '../../../../domain/entity/User'
import { Crypto } from '../../../../domain/service/Crypto'

describe('/login', () => {
  beforeAll(async () => {
    await i18next.start()
  })

  describe('should test failure', () => {
    describe('should not be able to login for not informing the data', () => {
      it('should test in pt-br', async () => {
        const response = await requester.post('/login')
        expect(response).toMatchObject(
          expect.objectContaining({
            status: StatusCodes.BAD_REQUEST,
            text: '{"error":[{"message":"Dados faltando"}]}',
          }),
        )
      })

      it('should test in en', async () => {
        const response = await requester.post('/login?lng=en')
        expect(response).toMatchObject(
          expect.objectContaining({
            status: StatusCodes.BAD_REQUEST,
            text: '{"error":[{"message":"Missing data"}]}',
          }),
        )
      })
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
      const userRepository = repositoryFactory.createUserRepository(i18n)
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
    it('should return the token for the data is correct', async () => {
      const passwordHash = await Crypto.encrypt('123456')
      const userRepository = repositoryFactory.createUserRepository(i18n)
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
