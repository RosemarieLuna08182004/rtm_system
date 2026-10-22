import * as yup from 'yup'

export const productValidator = () => {
    return yup.object({
        Name: yup.string()
          .matches(/^[A-Za-z\s.,-]+$/)
          .required(), // Only letters, no special characters or numbers
        Price: yup.number().positive().required(),
        Coins: yup.number().integer().positive().required(),
    });
}

