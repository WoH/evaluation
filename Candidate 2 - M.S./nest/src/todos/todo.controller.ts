import {
  Controller,
  Get,
  Post,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Put,
  Param,
  Body,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TodoService } from "./todo.service";
import { InjectUser } from "src/users/inject-user.decorator";
import { User } from "src/users/user.entity";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { TodoEntity } from "./todo.entity";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { GetTodoFilterDto } from "./dto/get-todo-filter.dto";

/**
 * @todo:
 * - Document auth
 * - Document Unauthorized and unexpected error response
 */
@Controller("todos")
@UseGuards(AuthGuard())
export class TodoController {
  constructor(private todoService: TodoService) {} // add agument: private todoService: TodoService

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
  @Get()
  async getTodos(@InjectUser() user: User, @Query() filters: GetTodoFilterDto) {
    return (await this.todoService.getAll(user, filters)).map(this.toDTO);
    // add parameters
    // return todoService.getAll
  }

  /**
   * @todo Add implementation, parameters, documentation and a fix the return type annotation
   */
  @Post()
  @UsePipes(ValidationPipe)
  async createTodo(@InjectUser() user: User, @Body() body: CreateTodoDto) {
    const todo = await this.todoService.create(body, user);
    return this.toDTO(todo);
    // add parameters
    // return todoService.create
  }

  /**
   * @todo Add implementation, fix route, parameters, documentation and a fix the return type annotation
   */
  @UsePipes(ValidationPipe)
  @Put(":id")
  async updateTodo(
    @InjectUser() user: User,
    @Param("id") id: string,
    @Body() body: UpdateTodoDto
  ) {
    const todo = await this.todoService.get(id, user);
    if (!todo) {
      throw new NotFoundException("Not found");
    }
    const updated = await this.todoService.update(todo, body);
    return this.toDTO(updated);
    // get the Todo, handle not found, pass it with the updates to todoService.update
  }

  /**
   * @todo Add implementation, fix route, parameters, documentation and a fix the return type annotation
   */
  @Delete(":id")
  async deleteTodo(@InjectUser() user: User, @Param("id") id: string) {
    const todo = await this.todoService.get(id, user);
    if (!todo) {
      throw new NotFoundException("Not found");
    }
    await this.todoService.remove(todo);
    return this.toDTO(todo);
    // get the Todo
    // handle not found
    //return todo
  }
}
