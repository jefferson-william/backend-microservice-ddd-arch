import { Course } from '../entity/Course'

export interface CourseRepository {
  findByPurchasesProductId(purchasesProductId: number): Promise<Course>
  list(): Promise<Course[]>
  count(): Promise<number>
  create(course: Course): Promise<void>
  clear(): Promise<void>
}
