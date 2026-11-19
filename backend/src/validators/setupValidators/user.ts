import Joi from "joi";
import { Roles } from "../../types";
import { COUNTRY_CODES } from "../../shared/data/countries";

// Two-letter code from the Google Play locations list (shared/data/countries.ts)
const country = Joi.string().valid(...COUNTRY_CODES).messages({
  "any.only": "Please choose a country from the list.",
  "any.required": "Please choose your country.",
});

export const userValidatorOnCreate = Joi.object({
  AccountType: Joi.string().valid(...Object.values(Roles)).required(),
  GoogleId: Joi.string().allow(null).optional(),
  Name: Joi.string().pattern(/^[a-zA-Z\s]+$/).required(), 
  Email: Joi.string().email().required(),
  Password: Joi.string().min(8).required(),
  Country: country.required(),
  ProfilePhoto: Joi.string().allow(null).optional(),
  AccessToken: Joi.string().allow(null).optional(),
  DateCreated: Joi.date().iso().optional(),
});

export const userValidatorOnUpdate = Joi.object({
  GoogleId: Joi.string().allow(null).optional(),
  Name: Joi.string().optional(), // Only letters, no special characters or numbers
  Email: Joi.string().email().optional(),
  Password: Joi.string().min(8).optional(),
  Country: country.optional(),
  ProfilePhoto: Joi.string().allow(null).optional(),
  AccessToken: Joi.string().allow(null).optional(),
  DateUpdated: Joi.date().iso().optional(),
});
