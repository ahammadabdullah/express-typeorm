import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";
import { httpUtils } from "../utils/http";
import { logger } from "../utils/logger";

export class AuthController {
  private authService = new AuthService();
  private userService = new UserService();

  async signup(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const existingUser = await this.userService.getUserByEmail(email);
      if (existingUser) {
        return httpUtils.sendValidationError(res, {
          email: "Email already in use",
        });
      }

      const result = await this.authService.signup(email, password);
      logger.info(`User signed up: ${email}`);

      return httpUtils.sendSuccess(
        res,
        201,
        result,
        "User created successfully"
      );
    } catch (error) {
      logger.error("Signup error", error);
      return httpUtils.sendError(res, 500, "An error occurred during signup");
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login(email, password);
      logger.info(`User logged in: ${email}`);

      return httpUtils.sendSuccess(res, 200, result, "Login successful");
    } catch (error: any) {
      logger.error("Login error", error);
      return httpUtils.sendError(
        res,
        401,
        error.message || "Invalid credentials"
      );
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      const user = this.userService.getUserWithoutPassword(req.user!);
      return httpUtils.sendSuccess(
        res,
        200,
        user,
        "User retrieved successfully"
      );
    } catch (error) {
      logger.error("Get me error", error);
      return httpUtils.sendError(res, 500, "An error occurred");
    }
  }
}
