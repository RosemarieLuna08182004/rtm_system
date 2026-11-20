import Joi from "joi";
import { Roles } from "../../types";
import { COUNTRY_CODES } from "../../shared/data/countries";

// Two-letter code from the Google Play locations list (shared/data/countries.ts)
const country = Joi.string().valid(...COUNTRY_CODES).messages({
  "any.only": "Please choose a country from the list.",
  "any.required": "Please choose your country.",
});

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
  // Optional here so sign-ups from the app version already on Google Play (no country field)
  // still work; the updated app requires it, and accounts without one are asked once in the app.
  Country: country.optional(),
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
  Country: country.optional(),
  ProfilePhoto: Joi.string().allow(null).optional(),
  // Sent as null by the web admin form; provider tokens are no longer stored.
  AccessToken: Joi.valid(null).optional(),
  DateUpdated: Joi.date().iso().optional(),
});
