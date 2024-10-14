import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "../auth.service";
import { Payload } from "./payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),   // Request Header에서 Bearer Token 추출
            ignoreExpiration: true,                                     // JWT Token 만료 검사, true 시 만료되더라도 error 리턴하지 않음
            secretOrKey: process.env.JWT_SECRET_KEY,
        })
    }

    // 검증 성공 시 request.user에 리턴값 저장
    async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
        const user = await this.authService.tokenValidateUser(payload);
        if (!user) {
            return done(new UnauthorizedException({ message: 'User does not exist' }), false);
        }
        return done(null, user);
    }
}