import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from "zod";
import { Env } from "../env/.env";
import { EnvService } from "../env/env.service";

const tokenSchema = z.object({
  sub: z.string().uuid()
})

export type UserPayload = z.infer<typeof tokenSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private envService: EnvService) {
    const publicKey = envService.get('JWT_PUBLIC_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256']
    })
  }

  async validate(payload: UserPayload) {
    return { sub: payload.sub };
  }
}