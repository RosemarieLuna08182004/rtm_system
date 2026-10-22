import * as yup from 'yup';

export const signInValidator = yup.object().shape({
    Email: yup.string()
      .trim()
      .required('Email is required')
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Enter a valid email address'
      ),
    // No length rule here: the server decides whether a password is correct.
    Password: yup.string()
      .required('Password is required'),
  });
