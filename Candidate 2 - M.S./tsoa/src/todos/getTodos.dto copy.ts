import { TodoProgress } from "./todo.entity";

export interface GetTodosDTO {
  /**
   * @minLength 3
   */
  search: string;
  progress: TodoProgress[];
}
