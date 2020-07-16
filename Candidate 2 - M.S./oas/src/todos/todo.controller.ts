import { Express, Request } from "express";
//import { TodoService } from "./todo.service";
import { authenticate } from "../util/authenticationMiddleware";
import { UUID } from "../util/UUID";
import { ErrorMessage } from "../util/errors";
import { TodoEntity } from "./todo.entity";

export function registerTodos(app: Express) {
  //const todoService = new TodoService();

  /**
   * @todo Add implementation, documentation and type annotations
   */
  app.get("/todos", authenticate, async (_req, _res) => {
    // Add parameter type annotations
    // return todoService.getAll
  });

  /**
   * @todo Add implementation, documentation and type annotations
   */
  app.post("/todos", authenticate, async (_req, _res) => {
    // add parameter type annotations
    // return todoService.create
  });

  /**
   * @todo Add implementation, fix route, parameters, documentation and a fix the return type annotation
   */
  app.put(
    "",
    authenticate,
    async (
      _req: Request<
        { id: UUID },
        ErrorMessage | TodoEntity,
        Partial<TodoEntity>,
        {}
      >,
      _res
    ) => {
      // get the Todo, handle not found, pass it with the updates to todoService.update
    }
  );

  /**
   * @todo Add implementation, fix route, parameters, documentation and a fix the return type annotation
   */
  app.delete(
    "",
    authenticate,
    async (
      _req: Request<{ id: UUID }, ErrorMessage | TodoEntity, void, {}>,
      _res
    ) => {
      // get the Todo
      // handle not found
      //return todo
    }
  );
}
