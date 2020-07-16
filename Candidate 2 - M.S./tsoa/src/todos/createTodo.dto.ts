import { TodoProgress } from "./todo.entity";

export interface CreateTodoDTO {
  /**
   * @minLength 3
   */
  title: string;
  description?: string;
  progress: TodoProgress;
}
