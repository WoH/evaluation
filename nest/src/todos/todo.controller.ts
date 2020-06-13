import {
  Controller,
  Get,
  Post,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Put,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * @todo:
 * - Document auth
 * - Document Unauthorized and unexpected error response
 */
@Controller("todos")
@UseGuards(AuthGuard())
export class TodoController {
  constructor() {} // add agument: private todoService: TodoService

  /**
   * @todo Add implementation, documentation and a fix the return type annotation
   */
  @Get()
  async getTodos() {
    // add parameters
    // return todoService.getAll
  }

  /**
   * @todo Add implementation, parameters, documentation and a fix the return type annotation
   */
  @Post()
  @UsePipes(ValidationPipe)
  async createTodo() {
    // add parameters
    // return todoService.create
  }

  /**
   * @todo Add implementation, fix route, parameters, documentation and a fix the return type annotation
   */
  @UsePipes(ValidationPipe)
  @Put()
  async updateTodo() {
    // get the Todo, handle not found, pass it with the updates to todoService.update
  }

  /**
   * @todo Add implementation, fix route, parameters, documentation and a fix the return type annotation
   */
  @Delete()
  async deleteTodo() {
    // get the Todo
    // handle not found
    //return todo
  }
}
