import Joi from "joi";

export const categoryValidateorOnCreate = Joi.object({
  Category: Joi.string()
    .pattern(/^[A-Za-z\s\-]+$/)
    .required(), // Only letters, no special characters or numbers
  Description: Joi.string().required(),
  CreatedBy: Joi.number().integer().positive().optional(),
  DateCreated: Joi.date().iso().optional(),
});

export const categoryValidateorOnUpdate = Joi.object({
  Id: Joi.string().optional(),
  Category: Joi.string()
    .pattern(/^[A-Za-z\s\-]+$/)
    .optional(), // Only letters, no special characters or numbers
  Description: Joi.string().optional(),
  UpdatedBy: Joi.number().integer().positive().optional(),
  DateUpdated: Joi.date().iso().optional(),
});
