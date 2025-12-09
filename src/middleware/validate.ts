import { Request, Response, NextFunction } from "express";
import { httpUtils } from "../utils/http";

export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    type?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

export const validate = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Record<string, string> = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      if (
        rules.required &&
        (value === undefined || value === null || value === "")
      ) {
        errors[field] = `${field} is required`;
        continue;
      }

      if (
        !rules.required &&
        (value === undefined || value === null || value === "")
      ) {
        continue;
      }

      if (rules.type && typeof value !== rules.type) {
        errors[field] = `${field} must be a ${rules.type}`;
        continue;
      }

   
      if (rules.minLength && value && value.length < rules.minLength) {
        errors[
          field
        ] = `${field} must be at least ${rules.minLength} characters`;
        continue;
      }

      if (rules.maxLength && value && value.length > rules.maxLength) {
        errors[
          field
        ] = `${field} must be at most ${rules.maxLength} characters`;
        continue;
      }

      if (rules.pattern && value && !rules.pattern.test(value)) {
        errors[field] = `${field} has an invalid format`;
        continue;
      }

      if (rules.custom) {
        const customError = rules.custom(value);
        if (customError) {
          errors[field] = customError;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return httpUtils.sendValidationError(res, errors);
    }

    next();
  };
};
