import * as yup from 'yup';

export const singUpValidator = yup.object().shape({
  Name: yup.string()
    .required('Name is required'),
  Email: yup.string()
    .required('Email is required')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Enter a valid email address'
    ),
  Password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
  Country: yup.string()
    .required('Please choose your country'),
});
