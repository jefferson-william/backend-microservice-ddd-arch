import './src/infra/environment'
import './src/test/mocks/api'
import './src/presentation/presenter/express'

if (process.env.DEBUG === 'jest') {
  jest.setTimeout(1000 * 60 * 5)
}
