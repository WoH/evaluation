import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserLoginDto } from "./dto/user-login.dto";
import { User, UserEntity } from "./user.entity";
import { FindConditions, Repository } from "typeorm";
import { UUID } from "src/util/uuid";
import { compare } from "bcryptjs";

export class ConflictError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>
  ) {}

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
