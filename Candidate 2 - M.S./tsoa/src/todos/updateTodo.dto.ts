import { TodoProgress } from "./todo.entity";

export interface UpdateTodoDTO {
  /**
   * @minLength 3
   */
  title?: string;
  description?: string;
  progress?: TodoProgress;
}
