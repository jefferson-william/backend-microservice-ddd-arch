import { I18n } from '../../domain/i18n'
import { RepositoryFactory } from '../../domain/factory/RepositoryFactory'
import { StudentRepository } from '../../domain/repository/StudentRepository'
import { EnrollmentRepository } from '../../domain/repository/EnrollmentRepository'
import { CourseRepository } from '../../domain/repository/CourseRepository'
import { CourseMemoryRepository } from '../repository/memory/CourseMemoryRepository'
import { EnrollmentMemoryRepository } from '../repository/memory/EnrollmentMemoryRepository'
import { StudentMemoryRepository } from '../repository/memory/StudentMemoryRepository'

class MemoryRepositoryFactory implements RepositoryFactory {
  createCourseRepository(i18n: I18n): CourseRepository {
    return new CourseMemoryRepository(i18n)
  }

  createStudentRepository(i18n: I18n): StudentRepository {
    return new StudentMemoryRepository(i18n)
  }

  createEnrollmentRepository(i18n: I18n): EnrollmentRepository {
    return new EnrollmentMemoryRepository()
  }
}

export const memoryRepositoryFactory = new MemoryRepositoryFactory()
