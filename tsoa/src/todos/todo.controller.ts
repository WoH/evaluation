import { Route, Controller, Post, Put, Get, Delete, Security } from "tsoa";
import { provideSingleton } from "../util/provideSingleton";

@Route("todos")
@Security("jwt")
@provideSingleton(TodosController)
// Add UnauthorizedError and Unexpected Error Response
export class TodosController extends Controller {
  /**
   * @todo: Inject the todoService:
   * @inject(TodoService) private todoService: TodoService
   */
  constructor() {
    super();
  }

  /**
   * @todo Add implementation, documentation and a fix the return type annotation
   */
  @Get()
  public async getTodos() {
    // add parameters
    // return todoService.getAll()
  }

  /**
   * @todo Add implementation, documentation and a fix the return type annotation
   */
  @Post()
  public async createTodo() {
    // add parameters
    // return todoService.create
  }

  /**
   * @todo Add implementation, fix route, parameters, documentation and a fix the return type annotation
   */
  @Put()
  public async updateTodo() {
    // get the Todo, handle not found, pass it with the updates to todoService.update
  }

  /**
   * @todo Add implementation, fix route, parameters, documentation and a fix the return type annotation
   */
  @Delete()
  public async deleteTodo() {
    // get the task
    // handle not found
    //return todo
  }
}
