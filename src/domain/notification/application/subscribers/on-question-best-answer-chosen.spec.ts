/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeAnswer } from 'test/factories/make-answer'
import { OnAnswerCreated } from './on-answer-created'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from '../usecases/send-notification'
import { makeQuestion } from 'test/factories/make-question'
import { MockInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sendNotification: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance
beforeEach(() => {
  inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
  inMemoryStudentsRepository = new InMemoryStudentsRepository()
  inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
  inMemoryQuestionAttachmentsRepository =
    new InMemoryQuestionAttachmentsRepository()
  inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
    inMemoryQuestionAttachmentsRepository,
    inMemoryAttachmentsRepository,
    inMemoryStudentsRepository,
  )
  inMemoryAnswerAttachmentsRepository =
    new InMemoryAnswerAttachmentsRepository()
  inMemoryAnswersRepository = new InMemoryAnswersRepository(
    inMemoryAnswerAttachmentsRepository,
  )

  sendNotification = new SendNotificationUseCase(
    inMemoryNotificationsRepository,
  )
  sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

  new OnQuestionBestAnswerChosen(inMemoryAnswersRepository, sendNotification)
})

describe('on question best answer chosen', () => {
  it('should send a notification when question has new best answer chosen', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    question.bestAnswerId = answer.id

    inMemoryQuestionsRepository.save(question)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
