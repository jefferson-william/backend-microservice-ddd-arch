import { StatusCodes } from 'http-status-codes'

export class InternalError extends Error {
  public code: number = StatusCodes.INTERNAL_SERVER_ERROR
}
