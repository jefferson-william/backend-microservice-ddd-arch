import { Crypto } from '../../../../domain/service/Crypto'

describe('Crypto', () => {
  test('should encrypt and compare password', async () => {
    const hash = await Crypto.encrypt('123456')
    const password = '123456'
    const compare = await Crypto.compare(password, hash)
    expect(compare).toBeTruthy()
  })
})
