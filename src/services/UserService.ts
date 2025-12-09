import { AppDataSource } from "../config/db";
import { User } from "../entities/User";
import { cryptoUtils } from "../utils/crypto";
import { logger } from "../utils/logger";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .getOne();

    return user || null;
  }

  async getUserByUuid(uuid: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { uuid } });
  }

  async createUser(email: string, password: string): Promise<User> {
    const hashedPassword = await cryptoUtils.hashPassword(password);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  getUserWithoutPassword(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
