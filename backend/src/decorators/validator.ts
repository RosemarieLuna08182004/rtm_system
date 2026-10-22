import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const Validate = <T = any>(schema: Joi.ObjectSchema<T>) => {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      try {
        await schema.validateAsync(req.body);
      } catch (error: any) {
        // Log only the rule that failed; the error object also carries the request body (passwords).
        logging.error("Validation failed:", error?.details?.[0]?.message ?? error?.message);

        const { message, path, type } = error.details?.[0] ?? {};
        return res.status(400).json({ message, path, type });
      }

      return originalMethod.call(this, req, res, next);
    };

    return descriptor;
  };
};
