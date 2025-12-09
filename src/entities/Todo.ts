import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

export enum TodoStatus {
  PENDING = "pending",
  DOING = "doing",
  COMPLETED = "completed",
}

@Entity("todos")
export class Todo {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "text", nullable: true })
  desc?: string;

  @Column({
    type: "enum",
    enum: TodoStatus,
    insert: false,
    default: TodoStatus.PENDING,
  })
  status!: TodoStatus;

  @ManyToOne(() => User, (user) => user.todos, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ select: false })
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
