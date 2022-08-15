import { Course } from '../entity/Course'

export interface CourseRepository {
  findByPurchasesProductId(purchasesProductId: number): Promise<Course>
  create(course: Course): Promise<void>
}
