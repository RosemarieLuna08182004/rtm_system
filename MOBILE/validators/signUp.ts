import * as yup from 'yup';

// Must match the backend rules (backend/src/validators/setupValidators/user.ts).
export const PASSWORD_MIN_LENGTH = 8;
// Latin letters incl. accented ones (ñ, é, ü...), spaces, periods, hyphens, apostrophes.
export const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ſ\s.'-]+$/;

export const singUpValidator = yup.object().shape({
  Name: yup.string()
    .trim()
    .required('Name is required')
    .matches(NAME_PATTERN, "Name can only contain letters, spaces, periods, hyphens and apostrophes"),
  Email: yup.string()
    .trim()
    .required('Email is required')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Enter a valid email address'
    ),
  Password: yup.string()
    .required('Password is required')
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`),
});
