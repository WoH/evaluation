import { inject } from "inversify";
import {
  Route,
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Security,
  Response,
  Res,
  Request,
  Query,
  Body,
  TsoaResponse,
} from "tsoa";
import { provideSingleton } from "../util/provideSingleton";
import { TodoProgress, TodoEntity } from "./todo.entity";
import { TodoService, TodoFilter } from "./todo.service";
import { User } from "../users/user.entity";
import { ErrorMessage } from "../util/errors";
import { UUID } from "../util/UUID";

@Route("todos")
@Security("jwt")
@provideSingleton(TodosController)
@Response<ErrorMessage>(500, "Unexpected Error")
export class TodosController extends Controller {
  constructor(@inject(TodoService) private todoService: TodoService) {
    super();
  }

  /**
   * <b>get ToDo List of User</b><br>
   * both query parameters are optional
   */
  @Response<ErrorMessage>(401, "Unauthorized")
  @Get()
  public async getTodos(
    @Request() request: any,
    @Res() invalidData: TsoaResponse<400, ErrorMessage>,
    @Query() searchFilter?: string,
    @Query() progressFilter?: TodoProgress[]
  ): Promise<TodoEntity[]> {
    if (searchFilter && searchFilter.length < 3) {
      return invalidData(400, {
        message:
          "the optional search filter is too short - must have at least 3 characters",
      });
    }

    let filter: TodoFilter = { search: searchFilter };
    if (progressFilter !== undefined && (progressFilter[0] as string) != "") {
      filter["progress"] = progressFilter;
    }
    console.log("@getTodos - filter: ", filter);
    return this.todoService.getAll(request.user as User, filter);
  }

  /**
   * <b>add a new ToDo</b><br>
   * body parameter 'title' is mandatory<br>
   * body parameter 'description' is optional<br>
   * valid values for optional body parameter 'progress': 'Not started' | 'In Progress' | 'Done'
   */
  @Response<ErrorMessage>(401, "Unauthorized")
  @Post()
  public async createTodo(
    @Request() request: any,
    @Body()
    body: {
      title: string;
      description?: string;
      progress?: TodoProgress;
    },
    @Res() invalidData: TsoaResponse<400, ErrorMessage>
  ): Promise<TodoEntity> {
    if (!body.title || body.title.length < 3) {
      return invalidData(400, {
        message: "Title missing or too short - must have at least 3 characters",
      });
    }

    let todo = {
      title: body.title,
      description: body.description,
      progress: body.progress ? body.progress : TodoProgress.NOT_STARTED,
    };
    return this.todoService.create(todo, request.user as User);
  }

  /**
   * <b>update a ToDo</b><br>
   * all body parameters are optional<br>
   * valid values for body parameter 'progress': 'Not started' | 'In Progress' | 'Done'
   */
  @Response<ErrorMessage>(401, "Unauthorized")
  @Put("/{id}")
  public async updateTodo(
    @Request() request: any,
    id: UUID,
    @Body()
    body: {
      title?: string;
      description?: string;
      progress?: TodoProgress;
    },
    @Res() notFound: TsoaResponse<404, ErrorMessage>,
    @Res() invalidData: TsoaResponse<400, ErrorMessage>
  ): Promise<TodoEntity> {
    const existingEntity = await this.todoService.get(id, request.user as User);
    if (!existingEntity) {
      return notFound(404, { message: "Not found" });
    }

    if (body.title && body.title.length < 3) {
      return invalidData(400, {
        message: "Title is too short - must have at least 3 characters",
      });
    }

    let newEntity = {
      title: body.title,
      description: body.description,
      progress: body.progress ? body.progress : existingEntity.progress,
    };
    return this.todoService.update(existingEntity, newEntity);
  }

  /**
   * <b>delete a ToDo</b><br>
   */
  @Response<ErrorMessage>(401, "Unauthorized")
  @Delete("/{id}")
  public async deleteTodo(
    @Request() request: any,
    id: UUID,
    @Res() notFound: TsoaResponse<404, ErrorMessage>
  ): Promise<TodoEntity> {
    const existingEntity = await this.todoService.get(id, request.user as User);
    if (!existingEntity) {
      return notFound(404, { message: "Not found" });
    }
    return this.todoService.remove(existingEntity);
  }
}
