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
        logging.error(error);

        return res.status(400).json(error.details[0]);
      }

      return originalMethod.call(this, req, res, next);
    };

    return descriptor;
  };
};
