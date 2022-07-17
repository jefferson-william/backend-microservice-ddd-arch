import { StatusCodes } from 'http-status-codes'
import { NotFoundError } from '../../../../domain/error/NotFoundError'
import { InternalError } from '../../../../domain/error/InternalError'

describe('NotFoundError', () => {
  it('should test error', () => {
    expect(() => {
      throw new NotFoundError('Testing')
    }).toThrow('Testing')
    try {
      throw new NotFoundError('Testing')
    } catch (error) {
      expect(error).toMatchObject({ code: StatusCodes.NOT_FOUND })
      expect(error).toBeInstanceOf(InternalError)
      expect(error).toBeInstanceOf(Error)
    }
  })
})
