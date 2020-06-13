import {
  Body,
  Controller,
  Post,
  Route,
  Response,
  Res,
  TsoaResponse,
} from "tsoa";
import { inject } from "inversify";
import { sign } from "jsonwebtoken";
import { provideSingleton } from "../util/provideSingleton";
import {
  ErrorMessage,
  ValidateErrorMessage,
  UnauthorizedErrorMessage,
} from "../util/errors";

import { User } from "./user.entity";
import { UserService, UserLoginDto, ConflictError } from "./user.service";

@Route("users")
@provideSingleton(UsersController)
@Response<ErrorMessage>(500, "Unexpected Error")
export class UsersController extends Controller {
  constructor(@inject(UserService) private userService: UserService) {
    super();
  }

  /**
   * Add a new user.
   */
  @Post()
  @Response<ValidateErrorMessage>(422, "Validation Failed")
  public async createUser(
    @Body() requestBody: UserLoginDto,
    @Res() validationError: TsoaResponse<422, ValidateErrorMessage>
  ): Promise<User> {
    try {
      return await this.userService.create(requestBody);
    } catch (err) {
      if (err instanceof ConflictError) {
        return validationError(422, {
          message: "Validation failed",
          details: { name: "username already taken" },
        });
      }
      throw err;
    }
  }

  /**
   * Login
   */
  @Response<UnauthorizedErrorMessage>(401, "Unauthorized")
  @Post("/login")
  public async login(
    @Body() body: { name: string; password: string },
    @Res() notFound: TsoaResponse<404, ErrorMessage>,
    @Res() unauthorized: TsoaResponse<401, ErrorMessage>
  ): Promise<{ token: string }> {
    const [user] = await this.userService.find({ name: body.name });

    if (!user) {
      return notFound(404, { message: "Not found" });
    }

    if (!(await this.userService.checkPasswork(user.id, body.password))) {
      return unauthorized(401, { message: "Unauthorized" });
    }

    const token = sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: "2 days" }
    );

    return { token };
  }
}
