import requester, { i18n } from '../../../mocks'

describe('/health', () => {
  beforeAll(async () => {
    await i18n.start()
  })

  describe('should test failure', () => {})

  describe('should test success', () => {
    describe('should test i18n languages', () => {
      it('should return success in pt-br with default', async () => {
        const response = await requester.get('/health').send()
        expect(response.body).toMatchObject({
          error: [],
          data: 'O servidor está ok',
        })
      })

      it('should return success in en via route', async () => {
        const response = await requester.get('/health?lng=en').send()
        expect(response.body).toMatchObject({
          error: [],
          data: 'The server is ok',
        })
      })
    })
  })
})
