import { Module } from "@nestjs/common";
import { TodoModule } from "./todos/todo.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./users/user.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "db",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "todo",
      synchronize: true,
      logging: true,
      entities: ["src/**/*.entity.ts"],
      cli: {
        entitiesDir: "src",
      },
    }),
    TodoModule,
    AuthModule,
  ],
})
export class AppModule {}
