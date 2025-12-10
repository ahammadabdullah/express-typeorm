import { DataSource, Repository } from "typeorm";
import { getDataSource } from "../config/db";
import { Todo, TodoStatus } from "../entities/Todo";
import redis from "../lib/redis";

export class TodoService {
  private dataSource!: DataSource;
  private todoRepository!: Repository<Todo>;

  constructor() {
    this.LoadAsync();
  }

  private LoadAsync = async () => {
    this.dataSource = await getDataSource();
    this.todoRepository = await this.dataSource.getRepository(Todo);
  };

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
    await redis.del(`todos:user:${userId}`);

    return this.todoRepository.save(todo);
  }
  async createTodoWithTransaction(
    userId: string,
    title: string,
    desc?: string
  ): Promise<Todo> {
    return await this.dataSource.transaction(async (manager) => {
      const todoRepo = manager.getRepository(Todo);

      const todo = todoRepo.create({
        title,
        desc,
        userId,
        status: TodoStatus.PENDING,
      });

      const savedTodo = await todoRepo.save(todo);

      return savedTodo;
    });
  }

  async getTodosByUser(userId: string): Promise<Todo[]> {
    const cached = await redis.get(`todos:user:${userId}`);
    if (cached) {
      console.log("returning from redis");
      return JSON.parse(cached) as Todo[];
    }
    console.log("returning from pg");
    const todos = await this.todoRepository
      .createQueryBuilder("todo")
      .where("todo.userId = :userId", { userId })
      .leftJoinAndSelect("todo.user", "users")
      .orderBy("todo.createdAt", "DESC")
      .getMany();
    await redis.set(`todos:user:${userId}`, JSON.stringify(todos), {
      EX: 2,
    });
    return todos;
  }

  async getTodoById(uuid: string, userId: string): Promise<Todo | null> {
    const todo = await this.todoRepository
      .createQueryBuilder("todo")
      .where("todo.uuid = :uuid", { uuid })
      .andWhere("todo.userId = :userId", { userId })
      .leftJoinAndSelect("todo.user", "users")
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
