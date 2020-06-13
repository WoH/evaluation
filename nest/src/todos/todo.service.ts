import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TodoEntity, TodoProgress } from "./todo.entity";
import { User } from "../users/user.entity";
import { UUID } from "src/util/uuid";
import { Repository } from "typeorm";

export interface TodoFilter {
  search?: string;
  progress?: TodoProgress[];
}

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private repository: Repository<TodoEntity>
  ) {}

  public async getAll(
    user: User,
    filters: TodoFilter = {}
  ): Promise<TodoEntity[]> {
    const { progress, search } = filters;
    const query = this.repository.createQueryBuilder("todo");

    query.where("todo.user = :userId", { userId: user.id });

    if (progress) {
      query.andWhere("todo.progress IN (:...progress)", { progress });
    }

    if (search) {
      query.andWhere(
        "(todo.title LIKE :search OR todo.description LIKE :search)",
        { search: `%${search}%` }
      );
    }

    const todos = await query.getMany();
    return todos;
  }

  /**
   * Returns a user's todo by uuid or `undefined` if none was found
   * @param id The uuid of the Todo
   * @param user The owner
   */
  public async get(id: UUID, user: User): Promise<TodoEntity | undefined> {
    return this.repository.findOne(id, { where: { user } });
  }

  public async create(
    todoCreationParams: Pick<TodoEntity, "title" | "description" | "progress">,
    user: User
  ): Promise<TodoEntity> {
    return this.repository.save({ ...todoCreationParams, user });
  }

  public async update(
    todo: TodoEntity,
    updates: Partial<TodoEntity>
  ): Promise<TodoEntity> {
    this.repository.merge(todo, updates);
    return this.repository.save(todo);
  }

  public async remove(todo: TodoEntity): Promise<TodoEntity> {
    return this.repository.remove(todo);
  }
}
