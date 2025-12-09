import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../entities/User";
import { logger } from "../utils/logger";
import { getDataSource } from "../config/db";

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader?.substring(7);

    const decoded = jwt.verify(token!, env.JWT_SECRET) as any;
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { uuid: decoded.uuid },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Auth guard error", error);
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};
