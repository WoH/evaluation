import { ApiProperty } from "@nestjs/swagger";
import { TodoProgress } from "../todo.entity";

/**
 * @todo Add:
 * - progress as an optional TodoProgress[], default is all 3 progress types
 * - search: an optional string with minLength 3
 */
export class GetTodoFilterDto {
  @ApiProperty({ minLength: 3 })
  search!: string;

  @ApiProperty()
  progress!: TodoProgress[];
}
