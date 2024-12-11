import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { NotAllowedError } from '@/domain/forum/application/usecases/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('create notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification()
    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: 'another-author-id',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()

    await inMemoryNotificationsRepository.create(notification)
    const result = await sut.execute({
      recipientId: 'authorId',
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryNotificationsRepository.items.length).toBe(1)
    expect(inMemoryNotificationsRepository.items[0].readAt).not.toBeNull()
  })
})
