import { RepositoryFactory } from '../../domain/factory/RepositoryFactory'
import { I18n } from '../../domain/i18n'
import { CourseRepository } from '../../domain/repository/CourseRepository'
import { StudentRepository } from '../../domain/repository/StudentRepository'
import { EnrollmentRepository } from '../../domain/repository/EnrollmentRepository'
import { Connection } from '../database/Connection'
import { CourseDatabaseRepository } from '../repository/database/CourseDatabaseRepository'
import { StudentDatabaseRepository } from '../repository/database/StudentDatabaseRepository'
import { EnrollmentDatabaseRepository } from '../repository/database/EnrollmentDatabaseRepository'
import { pgPromiseConnectionAdapterFactory } from './PgPromiseConnectionAdapterFactory'

export class DatabaseRepositoryFactory implements RepositoryFactory {
  constructor(readonly connection: Connection) {}

  createCourseRepository(i18n: I18n): CourseRepository {
    return new CourseDatabaseRepository(this.connection, i18n)
  }

  createStudentRepository(i18n: I18n): StudentRepository {
    return new StudentDatabaseRepository(this.connection, i18n)
  }

  createEnrollmentRepository(i18n: I18n): EnrollmentRepository {
    return new EnrollmentDatabaseRepository(this.connection, i18n)
  }
}

export const databaseRepositoryFactory = new DatabaseRepositoryFactory(
  pgPromiseConnectionAdapterFactory,
)
