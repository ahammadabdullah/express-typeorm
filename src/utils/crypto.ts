import bcrypt from "bcryptjs";
import crypto from "crypto";

const SALT_ROUNDS = 10;

export const cryptoUtils = {
  hashPassword: async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  comparePassword: async (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  },

  generateToken: (length: number = 32): string => {
    return crypto.randomBytes(length).toString("hex");
  },
};
