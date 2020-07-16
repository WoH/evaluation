import {
  Route,
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Security,
  Request,
  Body,
  Path,
  Response,
  Query,
  Res,
  TsoaResponse,
} from "tsoa";
import { provideSingleton } from "../util/provideSingleton";
import { TodoDTO } from "./todo.dto";
import { TodoService } from "./todo.service";
import { InjectUser } from "../util/userDecorator";
import { User } from "../users/user.entity";
import { CreateTodoDTO } from "./createTodo.dto";
import { UpdateTodoDTO } from "./updateTodo.dto";
import { TodoEntity, TodoProgress } from "./todo.entity";
import { ErrorMessage } from "../util/errors";
import { GetTodosDTO } from "./getTodos.dto copy";
import { inject } from "inversify";

@Route("todos")
@Security("jwt")
@provideSingleton(TodosController)
// Add UnauthorizedError and Unexpected Error Response
export class TodosController extends Controller {
  /**
   * @todo: Inject the todoService:
   * @inject(TodoService) private todoService: TodoService
   */
  constructor(@inject(TodoService) private todoService: TodoService) {
    super();
  }

  private toDTO(todo: TodoEntity) {
    return {
      title: todo.title,
      description: todo.description,
      progress: todo.progress,
      user: todo.user,
    };
  }

  /**
   * @todo Add implementation, documentation and a fix the return type annotation
   */
  @Get("/")
  public async getTodos(
    @Request() @InjectUser() user: User,
    @Query("progress") progress: TodoProgress[],
    /**
     * @minLength 3
     */
    @Query("search") search: string
  ): Promise<TodoDTO[]> {
    // add parameters
    const filters: GetTodosDTO = { progress, search };
    return (await this.todoService.getAll(user, filters)).map((todo) =>
      this.toDTO(todo)
    );
  }

  /**
   * @todo Add implementation, documentation and a fix the return type annotation
   */
  @Post("/")
  public async createTodo(
    @Body() body: CreateTodoDTO,
    @Request() @InjectUser() user: User
  ): Promise<TodoDTO> {
    const todo = await this.todoService.create(body, user);
    return this.toDTO(todo);
  }

  /**
   * @todo Add implementation, fix route, parameters, documentation and a fix the return type annotation
   */
  @Put("/{id}")
  @Response<ErrorMessage>(404, "Could not find toto")
  public async updateTodo(
    @Path("id") id: string,
    @Body() body: UpdateTodoDTO,
    @Request() @InjectUser() user: User,
    @Res() notFound: TsoaResponse<404, ErrorMessage>
  ): Promise<TodoDTO | ErrorMessage> {
    // get the Todo, handle not found, pass it with the updates to todoService.update
    const todo = await this.todoService.get(id, user);
    if (!todo) {
      return notFound(404, {
        message: "Could not find todo",
      });
    }
    const updated = await this.todoService.update(todo, body);
    return this.toDTO(updated);
  }

  /**
   * @todo Add implementation, fix route, parameters, documentation and a fix the return type annotation
   */
  @Delete("/{id}")
  public async deleteTodo(
    @Path("id") id: string,
    @Request() @InjectUser() user: User,
    @Res() notFound: TsoaResponse<404, ErrorMessage>
  ): Promise<TodoDTO | ErrorMessage> {
    const todo = await this.todoService.get(id, user);
    if (!todo) {
      return notFound(404, {
        message: "Could not find todo",
      });
    }
    await this.todoService.remove(todo);
    return todo;
    // get the task
    // handle not found
    //return todo
  }
}
