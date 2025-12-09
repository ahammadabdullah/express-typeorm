import { Request, Response } from "express";
import { TodoService } from "../services/TodoService";
import { httpUtils } from "../utils/http";
import { logger } from "../utils/logger";

export class TodoController {
  private todoService = new TodoService();

  async createTodo(req: Request, res: Response) {
    try {
      const { title, desc } = req.body;
      const userId = req.user!.uuid;

      const todo = await this.todoService.createTodo(userId, title, desc);
      logger.info(`Todo created for user ${userId}`);

      return httpUtils.sendSuccess(res, 201, todo, "Todo created successfully");
    } catch (error) {
      logger.error("Create todo error", error);
      return httpUtils.sendError(
        res,
        500,
        "An error occurred while creating todo"
      );
    }
  }

  async getTodos(req: Request, res: Response) {
    try {
      const userId = req.user!.uuid;

      const todos = await this.todoService.getTodosByUser(userId);
      logger.debug(`Retrieved ${todos.length} todos for user ${userId}`);

      return httpUtils.sendSuccess(
        res,
        200,
        todos,
        "Todos retrieved successfully"
      );
    } catch (error) {
      logger.error("Get todos error", error);
      return httpUtils.sendError(
        res,
        500,
        "An error occurred while fetching todos"
      );
    }
  }

  async getTodoById(req: Request, res: Response) {
    try {
      const { uuid } = req.params;
      const userId = req.user!.uuid;

      const todo = await this.todoService.getTodoById(uuid, userId);

      if (!todo) {
        return httpUtils.sendError(res, 404, "Todo not found");
      }

      return httpUtils.sendSuccess(
        res,
        200,
        todo,
        "Todo retrieved successfully"
      );
    } catch (error) {
      logger.error("Get todo by id error", error);
      return httpUtils.sendError(
        res,
        500,
        "An error occurred while fetching todo"
      );
    }
  }

  async updateTodo(req: Request, res: Response) {
    try {
      const { uuid } = req.params;
      const userId = req.user!.uuid;
      const { title, desc, status } = req.body;

      const updates: any = {};
      if (title !== undefined) updates.title = title;
      if (desc !== undefined) updates.desc = desc;
      if (status !== undefined) updates.status = status;

      const todo = await this.todoService.updateTodo(uuid, userId, updates);

      if (!todo) {
        return httpUtils.sendError(res, 404, "Todo not found");
      }

      logger.info(`Todo ${uuid} updated for user ${userId}`);
      return httpUtils.sendSuccess(res, 200, todo, "Todo updated successfully");
    } catch (error) {
      logger.error("Update todo error", error);
      return httpUtils.sendError(
        res,
        500,
        "An error occurred while updating todo"
      );
    }
  }

  async deleteTodo(req: Request, res: Response) {
    try {
      const { uuid } = req.params;
      const userId = req.user!.uuid;

      const deleted = await this.todoService.deleteTodo(uuid, userId);

      if (!deleted) {
        return httpUtils.sendError(res, 404, "Todo not found");
      }

      logger.info(`Todo ${uuid} deleted for user ${userId}`);
      return httpUtils.sendSuccess(res, 200, null, "Todo deleted successfully");
    } catch (error) {
      logger.error("Delete todo error", error);
      return httpUtils.sendError(
        res,
        500,
        "An error occurred while deleting todo"
      );
    }
  }
}
