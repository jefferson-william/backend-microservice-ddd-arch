import { Crypto } from '../../domain/service/Crypto'
import { InputValidationError } from '../../domain/error/InputValidationError'
import { UserRepository } from '../../domain/repository/UserRepository'
import { UnauthoriedError } from '../../domain/error/UnauthoriedError'

export class LoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    if (!input.email || !input.password) throw new InputValidationError('Missing data')
    const user = await this.userRepository.findByEmail(input.email)
    const comparedPassword = await Crypto.compare(input.password, user.password)
    if (!comparedPassword) throw new UnauthoriedError('Invalid password')
    return {
      token: '',
    }
  }
}

export type LoginInput = {
  email: string
  password: string
}

export type LoginOutput = {
  token: string
}
