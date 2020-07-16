import { TodoProgress } from "../todo.entity";
import { ApiProperty } from "@nestjs/swagger";

/**
 * @todo Fill out the class with:
 * - a required title (minLength 3, type string),
 * - optional description of type string
 * - progress of type TodoProgress
 */
export class CreateTodoDto {
  @ApiProperty({ minLength: 3 })
  title!: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  progress!: TodoProgress;
}
