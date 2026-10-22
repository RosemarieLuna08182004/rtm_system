import Joi from "joi";

export const salesValidatorOnCreate = Joi.object({
  SalesNumber: Joi.string()
    .pattern(/^\d{8}$/)
    .optional(), // 00000021
  SalesDate: Joi.date().iso().required(),
  TransactionId: Joi.string().required(),
  UserId: Joi.number().integer().positive().required(),
  MerchantName: Joi.string().required(),
  MerchantId: Joi.number().integer().required(),
  ProductName: Joi.string()
    .pattern(/^[0-9A-Za-z\s\-]+$/)
    .required(), // Only letters & numbers, no special characters
  ProductPrice: Joi.number().integer().positive().required(),
  Currency: Joi.string().required(),
  TotalAmount: Joi.number().integer().positive().required(),
  PaymentMethod: Joi.string().required(),
  PaymentToken: Joi.string().required(),
  ProductType: Joi.string().required(),
  ProductId: Joi.number().integer().positive().required(),
  BillingAddress: Joi.string().allow(null).optional(),
  Status: Joi.number().required(),
  DateCreated: Joi.date().iso().optional(),
  DateUpdated: Joi.date().iso().optional(),
});
