import { I18n } from '../../../domain/i18n'
import { NotFoundError } from '../../../domain/error/NotFoundError'
import { Course } from '../../../domain/entity/Course'
import { CourseRepository } from '../../../domain/repository/CourseRepository'

let data: Course[] = []

export class CourseMemoryRepository implements CourseRepository {
  constructor(private readonly i18n: I18n) {}

  async findByPurchasesProductId(purchasesProductId: number): Promise<Course> {
    const course = data.find((course) => course.purchasesProductId === purchasesProductId)
    if (!course) throw new NotFoundError(this.i18n.t('treatment.course_not_found'))
    return course
  }

  async list(): Promise<Course[]> {
    return data
  }

  async count(): Promise<number> {
    return data.length
  }

  async create(course: Course): Promise<void> {
    data.push(course)
  }

  async clear(): Promise<void> {
    data = []
  }
}
