import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Attachment,
  AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeAttachment(
  override?: Partial<AttachmentProps>,
  id?: UniqueEntityID,
): Attachment {
  const attachment = Attachment.create(
    {
      title: 'title',
      url: 'url',
      ...override,
    },
    id,
  )

  return attachment
}

@Injectable()
export class AttachmentFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaAttachment(data: Partial<AttachmentProps>): Promise<Attachment> {
    const attachment = makeAttachment(data)

    await this.prismaService.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    })

    return attachment
  }
}
