// user/userService.ts
import { User, UserEntity } from "./user.entity";
import { Repository, getConnection, FindConditions } from "typeorm";
import { UUID } from "../util/UUID";
import { compare } from "bcrypt";

/**
 * @schema UserLoginDto
 * type: object
 * properties:
 *   name:
 *     type: string
 *     minLength: 4
 *     maxLength: 20
 *   password:
 *     type: string
 *     minLength: 8
 *     maxLength: 20
 *     pattern: ((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$
 * required:
 *   - name
 *   - password
 */
export type UserLoginDto = Pick<UserEntity, "name" | "password">;

export class ConflictError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
export class UserService {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = getConnection().manager.getRepository(UserEntity);
  }

  public async get(id: string): Promise<User | undefined> {
    return this.repository.findOne(id);
  }

  public async find(options?: FindConditions<User>): Promise<User[]> {
    return this.repository.find(options);
  }

  /**
   * @throws ConflictError
   */
  public async create(userCreationParams: UserLoginDto): Promise<User> {
    const newUser = new UserEntity();
    this.repository.merge(newUser, userCreationParams);

    try {
      return await this.repository.save(newUser);
    } catch (error) {
      if (error.code === "23505") {
        // duplicate username
        throw new ConflictError("Username already exists");
      }
      throw error;
    }
  }

  public async checkPasswork(id: UUID, test: string): Promise<boolean> {
    const user = await this.repository.findOne(id, { select: ["password"] });

    if (!user) {
      return false;
    }

    return compare(test, user.password);
  }

  public async remove(user: User): Promise<User> {
    const userEntity = await this.repository.findOneOrFail(user.id);
    return this.repository.remove(userEntity);
  }
}
