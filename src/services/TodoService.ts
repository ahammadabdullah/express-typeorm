import { AppDataSource } from "../config/db";
import { Todo, TodoStatus } from "../entities/Todo";

export class TodoService {
  private todoRepository = AppDataSource.getRepository(Todo);

  async createTodo(
    userId: string,
    title: string,
    desc?: string
  ): Promise<Todo> {
    const todo = this.todoRepository.create({
      title,
      desc,
      userId,
      status: TodoStatus.PENDING,
    });

    return this.todoRepository.save(todo);
  }

  async getTodosByUser(userId: string): Promise<Todo[]> {
    const todos = await this.todoRepository
      .createQueryBuilder("todo")
      .where("todo.userId = :userId", { userId })
      .orderBy("todo.createdAt", "DESC")
      .getMany();

    return todos;
  }

  async getTodoById(uuid: string, userId: string): Promise<Todo | null> {
    const todo = await this.todoRepository
      .createQueryBuilder("todo")
      .where("todo.uuid = :uuid", { uuid })
      .andWhere("todo.userId = :userId", { userId })
      .getOne();

    return todo || null;
  }

  async updateTodo(
    uuid: string,
    userId: string,
    updates: { title?: string; desc?: string; status?: TodoStatus }
  ): Promise<Todo | null> {
    const todo = await this.getTodoById(uuid, userId);

    if (!todo) {
      return null;
    }

    await this.todoRepository
      .createQueryBuilder()
      .update(Todo)
      .set(updates)
      .where("uuid = :uuid", { uuid })
      .andWhere("userId = :userId", { userId })
      .execute();

    return this.getTodoById(uuid, userId);
  }

  async deleteTodo(uuid: string, userId: string): Promise<boolean> {
    const result = await this.todoRepository
      .createQueryBuilder()
      .delete()
      .from(Todo)
      .where("uuid = :uuid", { uuid })
      .andWhere("userId = :userId", { userId })
      .execute();

    return result.affected ? result.affected > 0 : false;
  }
}
