import { EnrollStudentToCourseHandler } from '../../application/handler/EnrollStudentToCourseHandler'
import { repositoryFactory } from './RepositoryFactory'
import { I18n } from '../../domain/i18n'

export class EnrollmentFactory {
  static getHandler(i18n: I18n) {
    return {
      enrollStudentToCourse: new EnrollStudentToCourseHandler(
        i18n,
        repositoryFactory.createCourseRepository(i18n),
        repositoryFactory.createStudentRepository(i18n),
        repositoryFactory.createEnrollmentRepository(i18n),
      ),
    }
  }
}
