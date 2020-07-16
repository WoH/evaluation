import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, MinLength, IsEnum } from "class-validator";
import { TodoProgress } from "../todo.entity";

/**
 * @todo Fill out the class with:
 * - a required title (minLength 3, type string),
 * - optional description of type string
 * - progress of type TodoProgress
 */
export class CreateTodoDto {

	@ApiProperty( {
		minLength: 3,
		type: String,
		description: 'mandatory ToDo Title string with minimal length of 3 characters'
	})
	@IsString()
	@MinLength(3)
	title!: string;

	@ApiPropertyOptional( {
		type: String,
		description: 'optional ToDo Description'
	})
	@IsString()
	description?: string;

	@ApiProperty( {
		enum: TodoProgress,
		default: TodoProgress.NOT_STARTED
	})
	@IsEnum(TodoProgress)
	progress!: TodoProgress; 
}

