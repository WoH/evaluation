import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "./user.entity";
import { UserService } from "./user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: User): Promise<User> {
    const { name } = payload;
    const [user] = await this.userService.find({ name });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
