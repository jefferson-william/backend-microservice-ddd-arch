import { StatusCodes } from 'http-status-codes'
import { GenericValidationError } from '../../../../domain/error/GenericValidationError'
import { InternalError } from '../../../../domain/error/InternalError'

describe('GenericValidationError', () => {
  it('should test error', () => {
    expect(() => {
      throw new GenericValidationError('Testing')
    }).toThrow('Testing')
    try {
      throw new GenericValidationError('Testing')
    } catch (error) {
      expect(error).toMatchObject({ code: StatusCodes.BAD_REQUEST })
      expect(error).toBeInstanceOf(InternalError)
      expect(error).toBeInstanceOf(Error)
    }
  })
})
