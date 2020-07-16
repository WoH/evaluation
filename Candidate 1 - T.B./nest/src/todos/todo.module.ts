import { Module } from "@nestjs/common";
import { TodoController } from "./todo.controller";
import { TodoService } from "./todo.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../users/user.module";
import { TodoEntity } from "./todo.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity]), AuthModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
