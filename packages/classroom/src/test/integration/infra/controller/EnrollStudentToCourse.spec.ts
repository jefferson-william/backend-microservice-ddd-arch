import { repositoryFactory } from '../../../../infra/factory/RepositoryFactory'
import { Course } from '../../../../domain/entity/Course'
import { Student } from '../../../../domain/entity/Student'
import { InternalError } from '../../../../domain/error/InternalError'
import { EnrollmentFactory } from '../../../../infra/factory/EnrollmentFactory'
import i18n from '../../../../domain/i18n'

const course = new Course(
  {
    id: 1,
    title: 'Title',
    purchasesProductId: 1,
  },
  'efff6af2-91d2-4725-bdc9-12db917f49cc',
)

const student = new Student(
  {
    id: 1,
    name: 'Student',
    email: 'student@email.com',
  },
  'efff6af2-91d2-4725-bdc9-12db917f49cc',
)

const getEnrollmentStudentToCourseInput = () => ({
  course,
  student,
  purchasesEnrolledByPurchaseId: 1,
})

describe('EnrollStudentToCourseHandler', () => {
  describe('should test failure', () => {
    describe('when not have a course', () => {
      it('should return an error', async () => {
        try {
          await EnrollmentFactory.getHandler(i18n).enrollStudentToCourse.handle({
            ...getEnrollmentStudentToCourseInput(),
            purchasesEnrolledByPurchaseId: undefined,
          })
        } catch (error) {
          expect(error).toBeInstanceOf(InternalError)
          expect(error).toMatchObject({
            message: 'Curso não encontrado',
          })
        }
      })
    })

    describe('when not have a student', () => {
      it('should return an error', async () => {
        const courseRepository = repositoryFactory.createCourseRepository(i18n)
        try {
          await courseRepository.create(course)
          await EnrollmentFactory.getHandler(i18n).enrollStudentToCourse.handle({
            ...getEnrollmentStudentToCourseInput(),
            purchasesEnrolledByPurchaseId: undefined,
          })
        } catch (error) {
          expect(error).toBeInstanceOf(InternalError)
          expect(error).toMatchObject({
            message: 'Estudante não encontrado',
          })
        }
        courseRepository.clear()
      })
    })

    describe('when not have a purchase id', () => {
      it('should return an error', async () => {
        const courseRepository = repositoryFactory.createCourseRepository(i18n)
        const studentRepository = repositoryFactory.createStudentRepository(i18n)
        try {
          await courseRepository.create(course)
          await studentRepository.create(student)
          await EnrollmentFactory.getHandler(i18n).enrollStudentToCourse.handle({
            ...getEnrollmentStudentToCourseInput(),
            purchasesEnrolledByPurchaseId: undefined,
          })
        } catch (error) {
          expect(error).toBeInstanceOf(InternalError)
          expect(error).toMatchObject({
            message: 'Dados faltando',
          })
        }
        courseRepository.clear()
        studentRepository.clear()
      })
    })
  })

  describe('should test success', () => {
    describe('when have previous saved data', () => {
      it('should not return error and saved data', async () => {
        const courseRepository = repositoryFactory.createCourseRepository(i18n)
        const studentRepository = repositoryFactory.createStudentRepository(i18n)
        const enrollmentRepository = repositoryFactory.createEnrollmentRepository(i18n)
        await studentRepository.create(student)
        await courseRepository.create(course)
        await EnrollmentFactory.getHandler(i18n).enrollStudentToCourse.handle(
          getEnrollmentStudentToCourseInput(),
        )
        expect(await courseRepository.count()).toEqual(1)
        expect(await studentRepository.count()).toEqual(1)
        expect(await enrollmentRepository.count()).toEqual(1)
        courseRepository.clear()
        studentRepository.clear()
        enrollmentRepository.clear()
      })
    })
  })
})
