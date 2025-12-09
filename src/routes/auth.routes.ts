import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validate } from "../middleware/validate";
import { authGuard } from "../middleware/authGuard";

const router = Router();
const authController = new AuthController();

const signupSchema = {
  email: {
    required: true,
    type: "string",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!value || value.trim() === "") return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Invalid email format";
      return null;
    },
  },
  password: {
    required: true,
    type: "string",
    minLength: 6,
    custom: (value: string) => {
      if (!value || value.length < 6)
        return "Password must be at least 6 characters";
      return null;
    },
  },
};

const loginSchema = {
  email: {
    required: true,
    type: "string",
  },
  password: {
    required: true,
    type: "string",
  },
};

router.post("/signup", validate(signupSchema), (req, res) =>
  authController.signup(req as any, res)
);

router.post("/login", validate(loginSchema), (req, res) =>
  authController.login(req as any, res)
);

router.get("/me", authGuard, (req, res) =>
  authController.getMe(req as any, res)
);

export default router;
