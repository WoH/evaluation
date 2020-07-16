import { ApiPropertyOptional } from "@nestjs/swagger";
import { TodoProgress } from "../todo.entity";
/**
 * @todo Fill out the class with:
 * - an optional title (minLength 3, type string),
 * - optional description of type string
 * - optional progress of type TodoProgress
 */
export class UpdateTodoDto {

	@ApiPropertyOptional( {
		type: String,
	})
	title?: string;

	@ApiPropertyOptional( {
		type: String,
		description: 'optional ToDo Description'
	})
	description?: string;

	@ApiPropertyOptional( {
		enum: TodoProgress,
	})
	
	progress?: TodoProgress; 
}

