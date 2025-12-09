import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Todo } from "./Todo";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  password!: string;

  @OneToMany(() => Todo, (todo) => todo.user, { cascade: true })
  todos!: Todo[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
