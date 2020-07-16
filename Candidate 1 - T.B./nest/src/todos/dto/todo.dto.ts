import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, IsEnum } from "class-validator";
import {TodoProgress} from "../todo.entity";

  
/**
 * @todo Fill out the class with:
 * - a required title (minLength 3, type string),
 * - required description of type string or null
 * - required progress of type TodoProgress
 */
export class TodoDto {
	@ApiProperty({
		pattern: `^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$`,
	})
	id!: string;

	@ApiProperty( {
		minLength: 3,
		type: String,
		description: 'mandatory ToDo Title string with minimal length of 3 characters'
	})
	@IsString()
	@MinLength(3)
	title!: string;

	@ApiProperty( {
		type: String,
		description: 'ToDo Description'
	})
	@IsString()
	description!: string | null;
	
	@ApiProperty( {
		enum: TodoProgress,
		description: 'the Progress'
	})
	@IsEnum(TodoProgress)
	progress!: TodoProgress;
}

