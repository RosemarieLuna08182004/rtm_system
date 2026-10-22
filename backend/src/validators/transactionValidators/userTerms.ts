import Joi from "joi";

export const userTermsOnCreate = Joi.object({
  UserId: Joi.number().integer().positive().required(),
  ChapterId: Joi.number().allow(null).optional(),
  TermId: Joi.number().allow(null).optional(),
  Status: Joi.number().required(),
  DateCreated: Joi.date().iso().optional(),
});

export const userTermsOnUpdate = Joi.object({
  UserId: Joi.number().integer().positive().optional(),
  ChapterId: Joi.number().allow(null).optional(),
  TermId: Joi.number().allow(null).optional(),
  Status: Joi.number().optional(),
  DateUpdated: Joi.date().iso().optional(),
});
