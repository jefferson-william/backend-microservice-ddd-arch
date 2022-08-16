import { Course } from '../../../../domain/entity/Course'

const getCourse = () =>
  new Course(
    {
      id: 1,
      title: 'Title',
      purchasesProductId: 1,
    },
    'efff6af2-91d2-4725-bdc9-12db917f49cc',
  )

describe('Course', () => {
  it('should validate the contract', async () => {
    const student = getCourse()
    const studentJSON = student.toJSON()
    const studentData = {
      id: student.id,
      title: student.title,
      purchasesProductId: student.purchasesProductId,
      uuid: student.uuid,
    }
    expect(studentData).toMatchObject(studentJSON)
  })
})
