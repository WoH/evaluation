import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  Unique,
  OneToMany,
} from "typeorm";
import { hash } from "bcryptjs";
import { TodoEntity } from "src/todos/todo.entity";
import { UUID } from "src/util/uuid";

export type User = Pick<UserEntity, "id" | "name">;

@Entity({ name: "user" })
@Unique(["name"])
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: UUID;

  @Column({ type: "text" })
  name!: string;

  @Column({
    type: "text",
    nullable: false,
    select: false,
  })
  password!: string;

  @BeforeInsert() async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => TodoEntity, (todo) => todo.user)
  todos?: TodoEntity[];

  public toJSON(): User {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
