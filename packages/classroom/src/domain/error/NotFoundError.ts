import { StatusCodes } from 'http-status-codes'
import { InternalError } from './InternalError'

export class NotFoundError extends InternalError {
  public code: number = StatusCodes.NOT_FOUND
}
