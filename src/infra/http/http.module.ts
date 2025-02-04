import { AnswerQuestionUseCase } from "@/domain/forum/application/usecases/answer-question";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/usecases/authenticate-student";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/usecases/choose-question-best-answer";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/usecases/comment-on-answer";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/usecases/comment-on-question";
import { CreateQuestionUseCase } from "@/domain/forum/application/usecases/create-question";
import { DeleteAnswerUseCase } from "@/domain/forum/application/usecases/delete-answer";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/usecases/delete-answer-comment";
import { DeleteQuestionUseCase } from "@/domain/forum/application/usecases/delete-question";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/usecases/delete-question-comment";
import { EditAnswerUseCase } from "@/domain/forum/application/usecases/edit-answer";
import { EditQuestionUseCase } from "@/domain/forum/application/usecases/edit-question";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/usecases/fetch-answer-comments";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/usecases/fetch-question-answers";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/usecases/fetch-question-comments";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/usecases/fetch-recent-questions";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/usecases/get-question-by-slug";
import { RegisterStudentUseCase } from "@/domain/forum/application/usecases/register-student";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { StorageModule } from "../storage/storage.module";
import { AnswerQuestionController } from "./controllers/answer-question.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { ChooseQuestionBestAnswerController } from "./controllers/choose-question-best-answer.controller";
import { CommentOnAnswerController } from "./controllers/comment-on-answer.controller";
import { CommentOnQuestionController } from "./controllers/comment-on-question.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { DeleteAnswerCommentController } from "./controllers/delete-answer-comment.controller";
import { DeleteAnswerController } from "./controllers/delete-answer.controller";
import { DeleteQuestionCommentController } from "./controllers/delete-question-comment.controller";
import { DeleteQuestionController } from "./controllers/delete-question.controller";
import { EditAnswerController } from "./controllers/edit-answer.controller";
import { EditQuestionController } from "./controllers/edit-question.controller";
import { FetchAnswerCommentsController } from "./controllers/fetch-answer-comments.controller";
import { FetchQuestionAnswersController } from "./controllers/fetch-question-answers.controller";
import { FetchQuestionCommentsController } from "./controllers/fetch-question-comments.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { GetQuestionBySlugController } from "./controllers/get-question-by-slug.controller";
import { UploadAttachmentController } from "./controllers/upload-attachment.controller";
import { UploadAndCreateAttachmentUseCase } from "@/domain/forum/application/usecases/upload-and-create-attachment";
import { ReadNotifcationController } from "./controllers/read-notification.controller";
import { ReadNotificationUseCase } from "@/domain/notification/application/usecases/read-notification";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController, 
    AuthenticateController, 
    CreateQuestionController, 
    FetchRecentQuestionsController, 
    GetQuestionBySlugController, 
    EditQuestionController, 
    DeleteQuestionController, 
    AnswerQuestionController, 
    EditAnswerController, 
    DeleteAnswerController, 
    FetchQuestionAnswersController, 
    ChooseQuestionBestAnswerController, 
    CommentOnQuestionController, 
    DeleteQuestionCommentController, 
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
    UploadAttachmentController,
    ReadNotifcationController
  ],
  providers: [
    CreateQuestionUseCase, 
    FetchRecentQuestionsUseCase, 
    AuthenticateStudentUseCase,
    RegisterStudentUseCase, 
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentUseCase,
    CommentOnAnswerUseCase,
    DeleteAnswerCommentUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentsUseCase,
    UploadAndCreateAttachmentUseCase,
    ReadNotificationUseCase
  ],
})
export class HttpModule {}