import { IsString, MinLength } from "class-validator";
import { TodoProgress } from "../todo.entity";
import { ApiPropertyOptional } from "@nestjs/swagger";
/**
 * @todo Add:
 * - progress as an optional TodoProgress[], default is all 3 progress types
 * - search: an optional string with minLength 3
 */
export class GetTodoFilterDto {
	
	@ApiPropertyOptional({
		type: [TodoProgress],
		default: [TodoProgress.NOT_STARTED, TodoProgress.IN_PROGRESS, TodoProgress.DONE]
	})
	progress?: TodoProgress[]; 
	
	@ApiPropertyOptional( {
		minLength: 3,
		type: String,
		description: 'optional text filter'
	})
	@IsString()
	@MinLength(3)
	search?: string;
}
