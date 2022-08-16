import { Student } from '../../../../../domain/entity/Student'
import { NotFoundError } from '../../../../../domain/error/NotFoundError'
import { StudentMemoryRepository } from '../../../../../infra/repository/memory/StudentMemoryRepository'
import i18n from '../../../../../domain/i18n'

describe('StudentMemoryRepository', () => {
  describe('should test failure', () => {
    it('should return error when fetching a non-existent student', async () => {
      const studentRepository = new StudentMemoryRepository(i18n)
      try {
        await studentRepository.findByEmail('email@email.com')
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError)
        expect(error).toMatchObject({
          message: 'Estudante não encontrado',
        })
      }
    })
  })

  describe('should test success', () => {
    it('should save and get student', async () => {
      const studentRepository = new StudentMemoryRepository(i18n)
      const student = new Student(
        {
          id: 1,
          name: 'Name',
          email: 'email@email.com',
        },
        null,
      )
      studentRepository.create(student)
      const data = await studentRepository.findByEmail(student.email)
      const list = await studentRepository.list()
      const count = await studentRepository.count()
      expect(data).toMatchObject(student)
      expect(list).toEqual([data])
      expect(count).toEqual(1)
      studentRepository.clear()
    })
  })
})
