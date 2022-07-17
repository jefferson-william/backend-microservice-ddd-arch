import { StatusCodes } from 'http-status-codes'
import { InputValidationError } from '../../../../domain/error/InputValidationError'
import { InternalError } from '../../../../domain/error/InternalError'

describe('InputValidationError', () => {
  it('should test error', () => {
    expect(() => {
      throw new InputValidationError('Testing')
    }).toThrow('Testing')
    try {
      throw new InputValidationError('Testing')
    } catch (error) {
      expect(error).toMatchObject({ code: StatusCodes.BAD_REQUEST })
      expect(error).toBeInstanceOf(InternalError)
      expect(error).toBeInstanceOf(Error)
    }
  })
})
