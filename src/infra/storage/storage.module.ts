import { Encrypter } from "@/domain/forum/application/cryptography/encrypter";
import { HashComparer } from "@/domain/forum/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { Uploader } from "@/domain/forum/application/storage/uploader";
import { Module } from "@nestjs/common";
import { R2Storage } from "./r2-storage";
import { EnvService } from "../env/env.service";
import { EnvModule } from "../env/env.module";

@Module({
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage
    },
  ],
  exports: [Uploader],
  imports: [EnvModule]
})
export class StorageModule {}