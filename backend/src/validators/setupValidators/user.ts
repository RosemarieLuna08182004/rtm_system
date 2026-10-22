import Joi from "joi";
import { Roles } from "../../types";

// Latin letters incl. accented ones (ñ, é, ü...), spaces, periods, hyphens, apostrophes.
// Keep in sync with MOBILE/validators/signUp.ts.
const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ſ\s.'-]+$/;

export const userValidatorOnCreate = Joi.object({
  // Ignored (forced to "user") unless the request comes from an administrator.
  AccountType: Joi.string().valid(...Object.values(Roles)).optional(),
  GoogleId: Joi.string().allow(null).optional(),
  Name: Joi.string().trim().pattern(NAME_PATTERN).required(),
  Email: Joi.string().email().required(),
  Password: Joi.string().min(8).required(),
  ProfilePhoto: Joi.string().allow(null).optional(),
  // Sent as null by the web admin form; provider tokens are no longer stored.
  AccessToken: Joi.valid(null).optional(),
  DateCreated: Joi.date().iso().optional(),
});

export const userValidatorOnUpdate = Joi.object({
  GoogleId: Joi.string().allow(null).optional(),
  Name: Joi.string().trim().pattern(NAME_PATTERN).optional(),
  Email: Joi.string().email().optional(),
  Password: Joi.string().min(8).optional(),
  CurrentPassword: Joi.string().optional(),
  ProfilePhoto: Joi.string().allow(null).optional(),
  // Sent as null by the web admin form; provider tokens are no longer stored.
  AccessToken: Joi.valid(null).optional(),
  DateUpdated: Joi.date().iso().optional(),
});
