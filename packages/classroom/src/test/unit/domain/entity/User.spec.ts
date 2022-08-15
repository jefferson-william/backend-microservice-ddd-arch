import { User } from '../../../../domain/entity/User'

let email = 'email@email.com'
let middleName = 'Meio'

const getUser = () =>
  new User(
    {
      id: 1,
      email,
      password: '123456',
      firstName: 'Nome',
      lastName: 'Sobrenome',
      middleName,
    },
    'efff6af2-91d2-4725-bdc9-12db917f49cc',
  )

describe('User', () => {
  it('should validate the contract', async () => {
    middleName = ''
    const user = getUser()
    const userJSON = user.toJSON()
    const userData = {
      id: user.id,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      uuid: user.uuid,
    }
    expect(userData).toMatchObject(userJSON)
  })

  it('should generate the instance of an incomplete user', async () => {
    middleName = ''
    const user = getUser()
    const userData = user.toJSON()
    expect(user.getFullName()).toEqual(`${userData.firstName} ${userData.lastName}`)
  })

  it('should generate the instance of a complete user', async () => {
    middleName = 'Meio'
    const user = getUser()
    const { uuid, password, ...userData } = user.toJSON()
    expect(user.getFullName()).toEqual(
      `${userData.firstName} ${userData.middleName} ${userData.lastName}`,
    )
  })
})
