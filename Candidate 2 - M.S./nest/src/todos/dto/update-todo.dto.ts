import { ApiProperty } from "@nestjs/swagger";
import { TodoProgress } from "../todo.entity";

/**
 * @todo Fill out the class with:
 * - an optional title (minLength 3, type string),
 * - optional description of type string
 * - optional progress of type TodoProgress
 */
export class UpdateTodoDto {
  @ApiProperty({ minLength: 3 })
  title!: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  progress?: TodoProgress;
}
