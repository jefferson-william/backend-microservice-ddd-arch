import { Enrollment } from '../../../../domain/entity/Enrollment'

const getEnrollment = () =>
  new Enrollment(
    {
      id: 1,
      studentId: 1,
      courseId: 1,
      purchasesEnrolledByPurchaseId: 1,
      inactivatedAt: new Date('2022-01-01'),
      createdAt: new Date('2022-01-01'),
    },
    'efff6af2-91d2-4725-bdc9-12db917f49cc',
  )

describe('Enrollment', () => {
  it('should validate the contract', async () => {
    const enrollment = getEnrollment()
    const enrollmentJSON = enrollment.toJSON()
    const enrollmentData = {
      id: enrollment.id,
      uuid: enrollment.uuid,
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      purchasesEnrolledByPurchaseId: enrollment.purchasesEnrolledByPurchaseId,
      inactivatedAt: enrollment.inactivatedAt,
      createdAt: enrollment.createdAt,
    }
    expect(enrollmentData).toMatchObject(enrollmentJSON)
  })
})
