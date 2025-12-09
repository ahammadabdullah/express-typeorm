import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { cryptoUtils } from "../utils/crypto";
import { User } from "../entities/User";
import { UserService } from "./UserService";

export class AuthService {
  private userService = new UserService();

  async signup(
    email: string,
    password: string
  ): Promise<{ user: Omit<User, "password">; token: string }> {
    const user = await this.userService.createUser(email, password);
    const token = this.generateToken(user);
    return {
      user: this.userService.getUserWithoutPassword(user),
      token,
    };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: Omit<User, "password">; token: string }> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await cryptoUtils.comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = this.generateToken(user);

    return {
      user: this.userService.getUserWithoutPassword(user),
      token,
    };
  }

  private generateToken(user: User): string {
    return jwt.sign({ uuid: user.uuid, email: user.email }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRY,
    } as any);
  }
}
