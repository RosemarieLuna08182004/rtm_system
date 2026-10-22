import Joi from "joi";

export const forgotPasswordValidator = Joi.object({
  Email: Joi.string().trim().email().required(),
});

export const resetPasswordValidator = Joi.object({
  resetToken: Joi.string().required(),
  Code: Joi.string().trim().pattern(/^\d{6}$/).required(),
  Password: Joi.string().min(8).required(),
});
