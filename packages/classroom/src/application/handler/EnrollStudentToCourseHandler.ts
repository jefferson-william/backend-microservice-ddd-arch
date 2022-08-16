import { StudentRepository } from '../../domain/repository/StudentRepository'
import { EnrollmentRepository } from '../../domain/repository/EnrollmentRepository'
import { CourseRepository } from '../../domain/repository/CourseRepository'
import { Enrollment } from '../../domain/entity/Enrollment'
import { Student } from '../../domain/entity/Student'
import { Course } from '../../domain/entity/Course'
import { InternalError } from '../../domain/error/InternalError'
import { I18n } from 'src/domain/i18n'

export class EnrollStudentToCourseHandler {
  constructor(
    private i18n: I18n,
    private courseRepository: CourseRepository,
    private studentRepository: StudentRepository,
    private enrollmentRepository: EnrollmentRepository,
  ) {}

  async handle(input: EnrollmentStudentToCourseInput): Promise<void> {
    let course = await this.courseRepository.findByPurchasesProductId(
      input.course.purchasesProductId,
    )
    if (!course) {
      course = new Course(
        {
          title: input.course.title,
          purchasesProductId: input.course.purchasesProductId,
        },
        null,
      )
      await this.courseRepository.create(course)
    }
    let student = await this.studentRepository.findByEmail(input.student.email)
    if (!student) {
      student = new Student(
        {
          name: input.student.name,
          email: input.student.email,
        },
        null,
      )
      await this.studentRepository.create(student)
    }
    if (!course.id || !student.id || !input.purchasesEnrolledByPurchaseId) {
      throw new InternalError(this.i18n.t('error.missing_data'))
    }
    const enrollment = new Enrollment(
      {
        courseId: course.id,
        studentId: student.id,
        purchasesEnrolledByPurchaseId: input.purchasesEnrolledByPurchaseId,
        inactivatedAt: undefined,
        createdAt: new Date(),
      },
      null,
    )
    await this.enrollmentRepository.create(enrollment)
  }
}

export type EnrollmentStudentToCourseInput = {
  student: {
    name: string
    email: string
  }
  course: {
    title: string
    purchasesProductId: number
  }
  purchasesEnrolledByPurchaseId?: number
}
