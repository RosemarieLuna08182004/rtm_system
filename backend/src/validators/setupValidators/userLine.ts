import Joi from "joi";

export const userLineValidatorOnCreate = Joi.object({
  UserId: Joi.number().allow(null).optional(),
  IsBundle: Joi.boolean().required(),
  DateCreated: Joi.date().iso().optional(),
});

export const userLineValidatorOnUpdate = Joi.object({
  UserId: Joi.number().allow(null).optional(),
  IsBundle: Joi.boolean().required(),
  DateUpdated: Joi.date().iso().optional(),
});
