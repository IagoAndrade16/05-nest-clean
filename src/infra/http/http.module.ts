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

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController, AuthenticateController, CreateQuestionController, FetchRecentQuestionsController, GetQuestionBySlugController, EditQuestionController, DeleteQuestionController, AnswerQuestionController],
  providers: [
    CreateQuestionUseCase, 
    FetchRecentQuestionsUseCase, 
    RegisterStudentUseCase, 
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase
  ],
})
export class HttpModule {}