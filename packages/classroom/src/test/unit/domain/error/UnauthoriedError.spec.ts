import { StatusCodes } from 'http-status-codes'
import { UnauthoriedError } from '../../../../domain/error/UnauthoriedError'
import { InternalError } from '../../../../domain/error/InternalError'

describe('UnauthoriedError', () => {
  it('should test error', () => {
    expect(() => {
      throw new UnauthoriedError('Testing')
    }).toThrow('Testing')
    try {
      throw new UnauthoriedError('Testing')
    } catch (error) {
      expect(error).toMatchObject({ code: StatusCodes.UNAUTHORIZED, message: 'Testing' })
      expect(error).toBeInstanceOf(InternalError)
      expect(error).toBeInstanceOf(Error)
    }
  })
})
