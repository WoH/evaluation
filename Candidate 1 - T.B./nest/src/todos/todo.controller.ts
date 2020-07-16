import {
  Controller,
  Get,
  Post,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Put,
  Query,
  Body,
  NotFoundException,
  Param
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TodoService } from "./todo.service";
import { TodoEntity } from "./todo.entity";
import { User } from "../users/user.entity";
import { InjectUser } from "src/users/inject-user.decorator";
import { GetTodoFilterDto } from "./dto/get-todo-filter.dto";
import { ApiBearerAuth, ApiOkResponse, ApiNotFoundResponse } from "@nestjs/swagger";
import { TodoDto } from "./dto/todo.dto";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UUID } from "src/util/uuid";
import { defaultErrorSchema } from "src/util/errorSchema";
import { UpdateTodoDto } from "./dto/update-todo.dto";


@ApiBearerAuth()
@Controller("todos")
@UseGuards(AuthGuard())
export class TodoController {
  constructor(private todoService: TodoService) {
  } 

  @Get()
  @ApiOkResponse({ type: [TodoDto] })
  async getTodos(
    @InjectUser() user: User, 
    @Query() filterDto: GetTodoFilterDto,
  ):Promise<TodoEntity[]> {
    console.log('called getToDos for user:', user);
    return this.todoService.getAll(user, filterDto);
  }

  /**
   * @todo Add implementation, parameters, documentation and a fix the return type annotation
   */
  @Post()
  @ApiOkResponse({ type: TodoDto })
  @UsePipes(ValidationPipe)
  async createTodo(
    @InjectUser() user: User, 
    @Body() dto: CreateTodoDto,
  ):Promise<TodoEntity> {
    console.log('called createTodo for user:', user);
    return this.todoService.create(dto, user);
  }

  /**
   * @todo Add implementation, fix route, parameters, documentation and a fix the return type annotation
   */
  
  @Put()
  @ApiOkResponse({ type: TodoDto })
  @ApiNotFoundResponse(defaultErrorSchema)
  @UsePipes(ValidationPipe)
  async updateTodo(
    @InjectUser() user: User, 
    @Param('id') id: UUID,
    @Body() newTodo: UpdateTodoDto,
  ):Promise<TodoEntity>  {

    const existingEntity = await this.todoService.get(id, user);
    if (!existingEntity) {
      throw new NotFoundException("Not found");;
    }

    return this.todoService.update(existingEntity, newTodo);
  }

  /**
   * @todo Add implementation, fix route, parameters, documentation and a fix the return type annotation
   */
  @Delete()
  @ApiOkResponse({ type: TodoDto })
  @ApiNotFoundResponse(defaultErrorSchema)
  async deleteTodo(
    @InjectUser() user: User, 
    @Param('id') id: UUID,
    ):Promise<TodoEntity>  {

      const existingEntity = await this.todoService.get(id, user);
      if (!existingEntity) {
        throw new NotFoundException("Not found");;
      }
  
      return this.todoService.remove(existingEntity);
  }
}
