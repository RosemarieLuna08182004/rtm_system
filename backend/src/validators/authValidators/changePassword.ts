import Joi from "joi";

export const changePasswordValidator = Joi.object({
  CurrentPassword: Joi.string().required(),
  NewPassword: Joi.string().min(8).max(128).invalid(Joi.ref("CurrentPassword")).required()
    .messages({ "any.invalid": "The new password must be different from the current one" }),
});
