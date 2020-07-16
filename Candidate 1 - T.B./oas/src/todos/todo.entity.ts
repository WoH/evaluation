import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserEntity } from "../users/user.entity";
import { UUID } from "../util/UUID";

export enum TodoProgress {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
}

@Entity({ name: "todo" })
export class TodoEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: UUID;

  @Column({ type: "text", nullable: false })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({
    enum: TodoProgress,
    default: TodoProgress.NOT_STARTED,
    nullable: false,
  })
  progress!: TodoProgress;

  @ManyToOne(() => UserEntity, (user) => user.todos)
  user?: UserEntity;
}
