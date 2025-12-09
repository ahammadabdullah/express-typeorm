import { getDataSource } from "../../config/db";
import { User } from "../../entities/User";
import { Todo, TodoStatus } from "../../entities/Todo";
import { cryptoUtils } from "../../utils/crypto";
import { logger } from "../../utils/logger";

export const seedDatabase = async () => {
  try {
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    const todoRepository = dataSource.getRepository(Todo);

    const userCount = await userRepository.count();
    if (userCount > 0) {
      logger.info("Database already seeded, skipping...");
      return;
    }

    logger.info("Starting database seeding...");

    const user1 = userRepository.create({
      email: "john@example.com",
      password: await cryptoUtils.hashPassword("password123"),
    });

    const user2 = userRepository.create({
      email: "jane@example.com",
      password: await cryptoUtils.hashPassword("password123"),
    });

    const savedUser1 = await userRepository.save(user1);
    const savedUser2 = await userRepository.save(user2);

    logger.info("Created 2 test users");

    const todo1 = todoRepository.create({
      title: "Buy groceries",
      desc: "Milk, eggs, bread, and vegetables",
      status: TodoStatus.PENDING,
      userId: savedUser1.uuid,
    });

    const todo2 = todoRepository.create({
      title: "Complete project",
      desc: "Finish the Express Todo API",
      status: TodoStatus.DOING,
      userId: savedUser1.uuid,
    });

    const todo3 = todoRepository.create({
      title: "Call dentist",
      desc: "Schedule appointment for next week",
      status: TodoStatus.COMPLETED,
      userId: savedUser1.uuid,
    });

    const todo4 = todoRepository.create({
      title: "Read a book",
      desc: "Start reading 'Clean Code'",
      status: TodoStatus.PENDING,
      userId: savedUser2.uuid,
    });

    const todo5 = todoRepository.create({
      title: "Exercise",
      desc: "30 minutes of running",
      status: TodoStatus.DOING,
      userId: savedUser2.uuid,
    });

    await todoRepository.save([todo1, todo2, todo3, todo4, todo5]);

    logger.info("Created 5 test todos");
    logger.info("Database seeding completed successfully!");
  } catch (error) {
    logger.error("Error seeding database", error);
    throw error;
  }
};
