import Joi from "joi";

export const productValidatorOnCreate = Joi.object({
  Name: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .required(), // Only letters, no special characters or numbers
  Price: Joi.number().positive().required(),
  CreatedBy: Joi.number().integer().positive().optional(),
  DateCreated: Joi.date().iso().optional(),
});

export const productValidatorOnUpdate = Joi.object({
  Name: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .optional(), // Only letters, no special characters or numbers
  Price: Joi.number().positive().optional(),
  UpdatedBy: Joi.number().integer().positive().optional(),
  DateCreated: Joi.date().iso().optional(),
});
