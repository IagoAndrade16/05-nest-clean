
import { InvalidAttachmentTypeError } from "@/domain/forum/application/usecases/errors/invalid-attachment-type";
import { UploadAndCreateAttachmentUseCase } from "@/domain/forum/application/usecases/upload-and-create-attachment";
import { BadRequestException, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('/attachments')
export class UploadAttachmentController {
  constructor(
    private uploadAttachment: UploadAndCreateAttachmentUseCase
  ) {}
  
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ 
          maxSize: 1024 * 1024 * 2 // 2MB
        }),
        new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' })
      ]
    })
  ) file: Express.Multer.File) {
    const result = await this.uploadAttachment.execute({
      body: file.buffer,
      fileName: file.originalname,
      fileType: file.mimetype
    })
    console.log('result', result)

    if(result.isLeft()) {
      throw new BadRequestException(result.value)
    }

    const { attachment } = result.value

    return {
      attachmentId: attachment.id.toString(),
    }
  }
}