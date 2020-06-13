import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserService, ConflictError } from "./user.service";
import { UserDto } from "./dto/user.dto";
import { JwtService } from "@nestjs/jwt";
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";
import { defaultErrorSchema } from "src/util/errorSchema";

@Controller("users")
@ApiInternalServerErrorResponse(defaultErrorSchema)
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse(defaultErrorSchema)
  @Post("/")
  async signUp(
    @Body(ValidationPipe) userCredentialsDto: UserLoginDto
  ): Promise<UserDto> {
    try {
      return await this.userService.create(userCredentialsDto);
    } catch (err) {
      if (err instanceof ConflictError) {
        throw new BadRequestException("Username already taken");
      }
      throw err;
    }
  }

  @ApiUnauthorizedResponse(defaultErrorSchema)
  @ApiBadRequestResponse(defaultErrorSchema)
  @ApiNotFoundResponse(defaultErrorSchema)
  @Post("/login")
  async login(
    @Body(ValidationPipe) userCredentialsDto: UserLoginDto
  ): Promise<{ token: string }> {
    const [user] = await this.userService.find({
      name: userCredentialsDto.name,
    });

    if (!user) {
      throw new NotFoundException("Not found");
    }

    if (
      !(await this.userService.checkPasswork(
        user.id,
        userCredentialsDto.password
      ))
    ) {
      throw new UnauthorizedException("Username and password didn't match");
    }

    const token = this.jwtService.sign({ id: user.id, name: user.name });

    return { token };
  }
}
