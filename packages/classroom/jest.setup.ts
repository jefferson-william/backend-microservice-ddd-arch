import './src/infra/environment'
import './src/test/mocks/default'

if (process.env.DEBUG === 'jest') {
  jest.setTimeout(1000 * 60 * 5)
}
