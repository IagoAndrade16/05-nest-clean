import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Env } from "src/.env";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService<Env, true>) => ({
        signOptions: {
          algorithm: 'RS256',
        },
        privateKey: Buffer.from(configService.get('JWT_PRIVATE_KEY', { infer: true }), 'base64').toString(),
        publicKey: Buffer.from(configService.get('JWT_PUBLIC_KEY', { infer: true }), 'base64').toString(),
      })
    })
  ],
  providers: [JwtStrategy]
})
export class AuthModule {}