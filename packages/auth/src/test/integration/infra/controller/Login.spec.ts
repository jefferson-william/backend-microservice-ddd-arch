import { repositoryFactory } from '../../../../infra/factory/RepositoryFactory'
import { LoginUseCase } from '../../../../application/usecase/LoginUseCase'
import { User } from '../../../../domain/entity/User'
import { Crypto } from '../../../../domain/service/Crypto'
import { InputValidationError } from '../../../../domain/error/InputValidationError'
import { NotFoundError } from '../../../../domain/error/NotFoundError'
import { UnauthoriedError } from '../../../../domain/error/UnauthoriedError'

const loginUseCaseFactory = () => new LoginUseCase(repositoryFactory.createUserRepository())
const getLoginInput = (password?: string) => ({
  email: 'email@email.com',
  password: password || '123456',
})
const getUser = (password: string) =>
  new User(
    {
      id: 1,
      email: 'email@email.com',
      password,
      firstName: 'Nome',
      lastName: 'Sobrenome',
      middleName: '',
    },
    'efff6af2-91d2-4725-bdc9-12db917f49cc',
  )

describe('LoginUseCase', () => {
  describe('should test failure', () => {
    it('should return data validation error', async () => {
      try {
        await loginUseCaseFactory().execute({
          email: '',
          password: '',
        })
      } catch (error) {
        expect(error).toBeInstanceOf(InputValidationError)
        expect(error).toMatchObject({
          message: 'Missing data',
        })
      }
    })

    it('should return user not found error', async () => {
      try {
        await loginUseCaseFactory().execute(getLoginInput())
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError)
        expect(error).toMatchObject({
          message: 'User not found',
        })
      }
    })

    it('should return user with invalid password error', async () => {
      const passwordHash = await Crypto.encrypt('123456')
      const userRepository = repositoryFactory.createUserRepository()
      userRepository.save(getUser(passwordHash))
      try {
        await loginUseCaseFactory().execute(getLoginInput('abcdef'))
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthoriedError)
        expect(error).toMatchObject({
          message: 'Invalid password',
        })
      }
      userRepository.clear()
    })
  })

  describe('should test success', () => {
    it('should return user not found error', async () => {
      const passwordHash = await Crypto.encrypt('123456')
      const userRepository = repositoryFactory.createUserRepository()
      userRepository.save(getUser(passwordHash))
      const output = await loginUseCaseFactory().execute(getLoginInput())
      expect(output).toMatchObject(
        expect.objectContaining({
          token: '',
        }),
      )
      userRepository.clear()
    })
  })

  // it('should return unauthorized by wrong password', async () => {
  //   const repository = repositoryFactory.createUserRepository()
  //   const user = getUser()
  //   repository.save(user)
  //   const response = await requester.post('/login').send({
  //     email: 'email@email.com',
  //     password: 'abcdef',
  //   })
  //   expect(response).toMatchObject(
  //     expect.objectContaining({
  //       statusCode: StatusCodes.UNAUTHORIZED,
  //     }),
  //   )
  // })

  // it('should not be able to log in for not informing the data', async () => {
  //   const response = await requester.post('/login')
  //   expect(response).toMatchObject(
  //     expect.objectContaining({
  //       statusCode: StatusCodes.BAD_REQUEST,
  //     }),
  //   )
  // })

  // it('should return unauthorized by wrong password', async () => {
  //   const repository = repositoryFactory.createUserRepository()
  //   const user = getUser()
  //   repository.save(user)
  //   const response = await requester.post('/login').send({
  //     email: 'email@email.com',
  //     password: 'abcdef',
  //   })
  //   expect(response).toMatchObject(
  //     expect.objectContaining({
  //       statusCode: StatusCodes.UNAUTHORIZED,
  //     }),
  //   )
  // })

  // it('must return the token for the data is correct', async () => {
  //   const repository = repositoryFactory.createUserRepository()
  //   const user = getUser()
  //   repository.save(user)
  //   const response = await requester.post('/login').send({
  //     email: 'email@email.com',
  //     password: '123456',
  //   })
  //   expect(response.body).toHaveProperty('token')
  // })
})
