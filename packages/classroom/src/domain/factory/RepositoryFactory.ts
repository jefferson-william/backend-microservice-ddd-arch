import { I18n } from '../i18n'
import { CourseRepository } from '../repository/CourseRepository'

export interface RepositoryFactory {
  createCourseRepository(i18n: I18n): CourseRepository
}
