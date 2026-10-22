import * as yup from 'yup';
import { PASSWORD_MIN_LENGTH } from './signUp';

export const forgotPasswordValidator = yup.object().shape({
  Email: yup.string()
    .trim()
    .required('Email is required')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'),
});

export const resetPasswordValidator = yup.object().shape({
  Code: yup.string()
    .trim()
    .required('Enter the 6-digit code from the email')
    .matches(/^\d{6}$/, 'The code has 6 digits'),
  Password: yup.string()
    .required('New Password is required')
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`),
  ConfirmPassword: yup.string()
    .required('Confirm password is required')
    .oneOf([yup.ref('Password')], 'Passwords must match'),
});
