import { TodoProgress } from "./todo.entity";
import { User } from "../users/user.entity";

export interface TodoDTO {
  /**
   * @minLength 3
   */
  title: string;
  /**
   * @default null
   */
  description?: string | null;
  progress: TodoProgress;
  user?: User;
}
