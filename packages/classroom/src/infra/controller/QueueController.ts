import { QUEUE } from '../../domain/constant'
import { I18n } from '../../domain/i18n'
import { RepositoryFactory } from '../../domain/factory/RepositoryFactory'
import { Queue } from '../queue/Queue'
import { EnrollmentFactory } from '../factory/EnrollmentFactory'

export class QueueController {
  constructor(readonly queue: Queue, readonly repositoryFactory: RepositoryFactory) {
    queue.consume(QUEUE.TOPIC.PURCHASE_NEW, async function (i18n: I18n, message: any) {
      EnrollmentFactory.getHandler(i18n).enrollStudentToCourse.handle({
        student: {
          name: message.customer.name,
          email: message.customer.email,
        },
        course: {
          title: message.product.title,
          purchasesProductId: message.product.id,
        },
        purchasesEnrolledByPurchaseId: message.purchaseId,
      })
    })
  }
}
