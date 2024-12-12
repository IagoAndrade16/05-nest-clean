import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { EnvService } from "../env/env.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { JwtStrategy } from "./jwt.strategy";
import { EnvModule } from "../env/env.module";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory: async (env: EnvService) => ({
        signOptions: {
          algorithm: 'RS256',
        },
        privateKey: Buffer.from(env.get('JWT_PRIVATE_KEY'), 'base64').toString(),
        publicKey: Buffer.from(env.get('JWT_PUBLIC_KEY'), 'base64').toString(),
      })
    })
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    JwtStrategy,
    EnvService
  ]
})
export class AuthModule {}