import { StatusCodes } from 'http-status-codes'
import { InternalError } from './InternalError'

export class GenericValidationError extends InternalError {
  public code: number = StatusCodes.BAD_REQUEST
}
