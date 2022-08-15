import { StudentRepository } from '../../domain/repository/StudentRepository'
import { EnrollmentRepository } from '../../domain/repository/EnrollmentRepository'
import { CourseRepository } from '../../domain/repository/CourseRepository'
import { Enrollment } from '../../domain/entity/Enrollment'
import { Student } from '../../domain/entity/Student'
import { Course } from '../../domain/entity/Course'
import { InternalError } from '../../domain/error/InternalError'

export class EnrollStudentToCourseHandler {
  constructor(
    private courseRepository: CourseRepository,
    private studentRepository: StudentRepository,
    private enrollmentRepository: EnrollmentRepository,
  ) {}

  async handle(payload: EnrollmentStudentToCourseInput): Promise<void> {
    let course = await this.courseRepository.findByPurchasesProductId(
      payload.course.purchasesProductId,
    )
    if (!course) {
      course = new Course(
        {
          title: payload.course.title,
          purchasesProductId: payload.course.purchasesProductId,
        },
        null,
      )
      await this.courseRepository.create(course)
    }
    let student = await this.studentRepository.findByEmail(payload.student.email)
    if (!student) {
      student = new Student(
        {
          name: payload.student.name,
          email: payload.student.email,
        },
        null,
      )
      await this.studentRepository.create(student)
    }
    if (!course.id || !student.id || !payload.purchasesEnrolledByPurchaseId) {
      throw new InternalError()
    }
    const enrollment = new Enrollment(
      {
        courseId: course.id,
        studentId: student.id,
        purchasesEnrolledByPurchaseId: payload.purchasesEnrolledByPurchaseId,
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
