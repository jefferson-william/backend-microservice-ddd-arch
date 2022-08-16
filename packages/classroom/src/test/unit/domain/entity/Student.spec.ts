import { Student } from '../../../../domain/entity/Student'

const getStudent = () =>
  new Student(
    {
      id: 1,
      name: 'Name',
      email: 'email@email.com',
    },
    'efff6af2-91d2-4725-bdc9-12db917f49cc',
  )

describe('Student', () => {
  it('should validate the contract', async () => {
    const student = getStudent()
    const studentJSON = student.toJSON()
    const studentData = {
      id: student.id,
      name: student.name,
      email: student.email,
      uuid: student.uuid,
    }
    expect(studentData).toMatchObject(studentJSON)
  })
})
