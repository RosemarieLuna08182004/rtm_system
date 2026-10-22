import Joi from "joi";

export const chapterValidatorOnCreate = Joi.object({
  Title: Joi.string()
    .pattern(/^[A-Za-z\s\-]+$/)
    .required(), // Only letters, no special characters or numbers
  Coins: Joi.number().integer().allow(0).optional(),
  CreatedBy: Joi.number().integer().positive().optional(),
  DateCreated: Joi.date().iso().optional(),
});

export const chapterValidatorOnUpdate = Joi.object({
  Title: Joi.string()
    .pattern(/^[A-Za-z\s\-]+$/)
    .optional(), // Only letters, no special characters or numbers
  Coins: Joi.number().integer().allow(0).optional(),
  UpdatedBy: Joi.number().integer().positive().optional(),
  DateUpdated: Joi.date().iso().optional(),
});
