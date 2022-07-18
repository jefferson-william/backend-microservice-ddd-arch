import { StatusCodes } from 'http-status-codes'
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
          message: 'Dados faltando',
          code: StatusCodes.BAD_REQUEST,
        })
      }
    })

    it('should return user not found error', async () => {
      try {
        await loginUseCaseFactory().execute(getLoginInput())
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError)
        expect(error).toMatchObject({
          message: 'Usuário não encontrado',
          code: StatusCodes.NOT_FOUND,
        })
      }
    })

    it('should return unauthorized by wrong password', async () => {
      const passwordHash = await Crypto.encrypt('123456')
      const userRepository = repositoryFactory.createUserRepository()
      userRepository.save(getUser(passwordHash))
      try {
        await loginUseCaseFactory().execute(getLoginInput('abcdef'))
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthoriedError)
        expect(error).toMatchObject({
          message: 'Senha incorreta',
          code: StatusCodes.UNAUTHORIZED,
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
})
