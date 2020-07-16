import { ApiProperty } from "@nestjs/swagger";
import { TodoProgress } from "../todo.entity";
import { User } from "src/users/user.entity";

/**
 * @todo Fill out the class with:
 * - a required title (minLength 3, type string),
 * - required description of type string or null
 * - required progress of type TodoProgress
 */
export class TodoDto {
  @ApiProperty({ minLength: 3 })
  title!: string;

  @ApiProperty()
  description?: string | null;

  @ApiProperty()
  progress!: TodoProgress;

  @ApiProperty()
  user?: User;
}
