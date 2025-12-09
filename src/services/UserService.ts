import { DataSource, Repository } from "typeorm";
import { User } from "../entities/User";
import { cryptoUtils } from "../utils/crypto";
import { getDataSource } from "../config/db";

export class UserService {
  private dataSource!: DataSource;
  private userRepository!: Repository<User>;

  constructor() {
    this.LoadAsync();
  }

  private LoadAsync = async () => {
    this.dataSource = await getDataSource();
    this.userRepository = await this.dataSource.getRepository(User);
  };

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
