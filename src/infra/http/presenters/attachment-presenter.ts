import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { url } from "inspector";

export class AttachmentPresenter {
  public static toHTTP(attachment: Attachment) {
    return {
      id: attachment.id.toString(),
      url: attachment.url,
      title: attachment.title,
    };
  }
}