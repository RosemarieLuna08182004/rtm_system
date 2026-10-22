import Joi from "joi";

export const termLineValidatorOnCreate = Joi.object({
  TermId: Joi.number().integer().positive().required(),
  CategoryId: Joi.number().integer().positive().required(),
  Term: Joi.string()
    .pattern(/^[A-Za-z\s,.'-/]+$/)
    .allow(null)
    .allow("")
    .optional(), // Only letters, no special characters or numbers
  Description: Joi.string().allow(null).optional(),
  Position: Joi.number().integer().positive().required(),
  IsBorderLeft: Joi.boolean().optional(),
  Illustration: Joi.string().allow(null).allow("").optional(),
  CreatedBy: Joi.number().integer().positive().optional(),
  DateCreated: Joi.date().iso().optional(),
});

export const termLineValidatorOnUpdate = Joi.object({
  TermId: Joi.number().integer().positive().optional(),
  CategoryId: Joi.number().integer().positive().optional(),
  Term: Joi.string()
    .pattern(/^[A-Za-z\s.,'-/]+$/)
    .allow(null)
    .allow("")
    .optional(), // Only letters, no special characters or numbers
  Description: Joi.string().allow(null).optional(),
  Position: Joi.number().integer().positive().required(),
  IsBorderLeft: Joi.boolean().optional(),
  Illustration: Joi.string().allow(null).allow("").optional(),
  UpdatedBy: Joi.number().integer().positive().optional(),
  DateUpdated: Joi.date().iso().optional(),
});
