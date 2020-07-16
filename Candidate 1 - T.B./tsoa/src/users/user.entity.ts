import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  Unique,
  OneToMany,
} from "typeorm";
import { UUID } from "../util/UUID";
import { hash } from "bcryptjs";
import { TodoEntity } from "../todos/todo.entity";

/**
 * User objects allow you to associate actions performed in the system with the user that performed them.
 * The User object containes common information across every user in the system regardless of status and role.
 */
export type User = Pick<UserEntity, "id" | "name">;

@Entity({ name: "user" })
@Unique(["name"])
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: UUID;

  /**
   * @minLength 4
   * @maxLength 20
   */
  @Column({ type: "text" })
  name!: string;

  /**
   * @minLength 8
   * @maxLength 20
   * @pattern ((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$
   */
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
