import { StatusCodes } from 'http-status-codes'
import { InternalError } from './InternalError'

export class UnauthoriedError extends InternalError {
  public code: number = StatusCodes.UNAUTHORIZED
}
