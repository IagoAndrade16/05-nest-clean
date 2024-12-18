import { FakeUploader } from 'test/cryptography/fake-uploader'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'


let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let uploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and create attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    uploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentUseCase(inMemoryAttachmentsRepository, uploader)
  })

  it.only('should be able to create an attachment', async () => {
    const result = await sut.execute({
      body: Buffer.from(''),
      fileName: 'profile.png',
      fileType: 'png',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })

    expect(uploader.uploads).toHaveLength(1)
    expect(uploader.uploads[0].fileName).toBe('profile.png')
  })

  it('should not be able to create an attachment with not allowed mime type', async () => {
    const result = await sut.execute({
      body: Buffer.from(''),
      fileName: 'profile.png',
      fileType: 'audio/mp3',
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
