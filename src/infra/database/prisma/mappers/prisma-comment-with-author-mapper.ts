import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { Comment as PrismaComment, User as PrismaUser} from '@prisma/client'

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
}

export class PrismaCommentwithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityID(raw.id),
      content: raw.content,
      authorId: new UniqueEntityID(raw.author.id),
      author: raw.author.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}