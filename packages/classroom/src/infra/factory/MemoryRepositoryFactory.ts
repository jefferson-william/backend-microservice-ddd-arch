import { RepositoryFactory } from '../../domain/factory/RepositoryFactory'
import { I18n } from '../../domain/i18n'
import { CourseRepository } from '../../domain/repository/CourseRepository'
import { CourseMemoryRepository } from '../repository/memory/CourseMemoryRepository'

class MemoryRepositoryFactory implements RepositoryFactory {
  createCourseRepository(i18n: I18n): CourseRepository {
    return new CourseMemoryRepository(i18n)
  }
}

export const memoryRepositoryFactory = new MemoryRepositoryFactory()
