import { Router } from "express";
import { TodoController } from "../controllers/TodoController";
import { authGuard } from "../middleware/authGuard";
import { validate } from "../middleware/validate";
import { TodoStatus } from "../entities/Todo";

const router = Router();
const todoController = new TodoController();

const createTodoSchema = {
  title: {
    required: true,
    type: "string",
    minLength: 1,
  },
  desc: {
    required: false,
    type: "string",
  },
};

const updateTodoSchema = {
  title: {
    required: false,
    type: "string",
  },
  desc: {
    required: false,
    type: "string",
  },
  status: {
    required: false,
    type: "string",
    custom: (value: string) => {
      if (value && !Object.values(TodoStatus).includes(value as TodoStatus)) {
        return `Status must be one of: ${Object.values(TodoStatus).join(", ")}`;
      }
      return null;
    },
  },
};

router.post("/", authGuard, validate(createTodoSchema), (req, res) =>
  todoController.createTodo(req as any, res)
);

router.get("/", authGuard, (req, res) =>
  todoController.getTodos(req as any, res)
);

router.get("/:uuid", authGuard, (req, res) =>
  todoController.getTodoById(req as any, res)
);

router.put("/:uuid", authGuard, validate(updateTodoSchema), (req, res) =>
  todoController.updateTodo(req as any, res)
);

router.delete("/:uuid", authGuard, (req, res) =>
  todoController.deleteTodo(req as any, res)
);

export default router;
