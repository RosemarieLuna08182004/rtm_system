import Joi from "joi";

export const loginValidator = Joi.object({
  Email: Joi.string().email().required(),
  Password: Joi.string().min(8).required(),
});
