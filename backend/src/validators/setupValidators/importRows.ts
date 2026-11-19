import Joi from "joi";

/** Most rows one spreadsheet import may send. */
export const MAX_IMPORT_ROWS = 1000;

const text = (max: number) => Joi.string().allow("", null).max(max);

// Only the shape is checked here; names and duplicates are checked row by row
// so each problem can be reported against its spreadsheet row.
export const importRowsValidator = Joi.object({
  DryRun: Joi.boolean().required(),
  Terms: Joi.array().items(Joi.object({
    Row: Joi.number().integer().min(1).required(),
    Volume: text(255),
    Term: text(1000),
    Focus: text(1000),
  })).default([]),
  SubTerms: Joi.array().items(Joi.object({
    Row: Joi.number().integer().min(1).required(),
    Volume: text(255),
    Term: text(1000),
    Category: text(255),
    Title: text(1000),
    Description: text(20000),
  })).default([]),
}).custom((value, helpers) =>
  value.Terms.length + value.SubTerms.length > MAX_IMPORT_ROWS
    ? helpers.message({ custom: `An import can have at most ${MAX_IMPORT_ROWS} rows. Split the file into smaller ones.` })
    : value);
