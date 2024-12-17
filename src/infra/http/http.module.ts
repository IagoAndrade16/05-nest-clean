import { AuthenticateStudentUseCase } from "@/domain/forum/application/usecases/authenticate-student";
import { CreateQuestionUseCase } from "@/domain/forum/application/usecases/create-question";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/usecases/fetch-recent-questions";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/usecases/get-question-by-slug";
import { RegisterStudentUseCase } from "@/domain/forum/application/usecases/register-student";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { GetQuestionBySlugController } from "./controllers/get-question-by-slug.controller";
import { EditQuestionController } from "./controllers/edit-question.controller";
import { EditQuestionUseCase } from "@/domain/forum/application/usecases/edit-question";
import { DeleteQuestionController } from "./controllers/delete-question.controller";
import { DeleteQuestionUseCase } from "@/domain/forum/application/usecases/delete-question";
import { AnswerQuestionUseCase } from "@/domain/forum/application/usecases/answer-question";
import { AnswerQuestionController } from "./controllers/answer-question.controller";
import { EditAnswerUseCase } from "@/domain/forum/application/usecases/edit-answer";
import { EditAnswerController } from "./controllers/edit-answer.controller";
import { DeleteAnswerUseCase } from "@/domain/forum/application/usecases/delete-answer";
import { DeleteAnswerController } from "./controllers/delete-answer.controller";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/usecases/fetch-question-answers";
import { FetchQuestionAnswersController } from "./controllers/fetch-question-answers.controller";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/usecases/choose-question-best-answer";
import { ChooseQuestionBestAnswerController } from "./controllers/choose-question-best-answer.controller";
import { CommentOnQuestionController } from "./controllers/comment-on-question.controller";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/usecases/comment-on-question";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController, AuthenticateController, CreateQuestionController, FetchRecentQuestionsController, GetQuestionBySlugController, EditQuestionController, DeleteQuestionController, AnswerQuestionController, EditAnswerController, DeleteAnswerController, FetchQuestionAnswersController, ChooseQuestionBestAnswerController, CommentOnQuestionController],
  providers: [
    CreateQuestionUseCase, 
    FetchRecentQuestionsUseCase, 
    RegisterStudentUseCase, 
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase
  ],
})
export class HttpModule {}