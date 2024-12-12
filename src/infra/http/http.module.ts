import { CreateQuestionUseCase } from "@/domain/forum/application/usecases/create-question";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/usecases/fetch-recent-questions";
import { RegisterStudentUseCase } from "@/domain/forum/application/usecases/register-student";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/usecases/authenticate-student";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController, AuthenticateController, CreateQuestionController, FetchRecentQuestionsController],
  providers: [
    CreateQuestionUseCase, 
    FetchRecentQuestionsUseCase, 
    RegisterStudentUseCase, 
    AuthenticateStudentUseCase
  ],
})
export class HttpModule {}