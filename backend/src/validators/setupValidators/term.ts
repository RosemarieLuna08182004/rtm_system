import Joi from "joi";

export const termValidatorOnCreate = Joi.object({
  ChapterId: Joi.number().integer().positive().required(),
  Term: Joi.string()
    .pattern(/^[A-Za-z\s.,'-/]+$/)
    .allow(null)
    .optional(), // Only letters, no special characters or numbers
  Focus: Joi.string().allow(null).optional(),
  Definition: Joi.string().allow(null).optional(),
  VoiceOver: Joi.string().allow(null).optional(),
  Illustration: Joi.string().allow(null).optional(),
  CreatedBy: Joi.number().integer().positive().optional(),
  DateCreated: Joi.date().iso().optional(),
});

export const termValidatorOnUpdate = Joi.object({
  ChapterId: Joi.number().integer().positive().optional(),
  Term: Joi.string()
    .pattern(/^[A-Za-z\s.,'-/]+$/)
    .allow(null)
    .optional(), // Only letters, no special characters or numbers
  Focus: Joi.string().allow(null).optional(),
  Definition: Joi.string().allow(null).optional(),
  VoiceOver: Joi.string().allow(null).optional(),
  Illustration: Joi.string().allow(null).optional(),
  UpdatedBy: Joi.number().integer().positive().optional(),
  DateUpdated: Joi.date().iso().optional(),
});
