import * as yup from 'yup';
import { PASSWORD_MIN_LENGTH } from './signUp';

export const changePassValidator = yup.object().shape({
  CurrentPass: yup.string()
    .required('Current Password is required'),
  NewPassword: yup.string()
    .required('New Password is required')
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`)
    .notOneOf([yup.ref('CurrentPass')], 'New password must be different from the current password'),
  ConfirmPassword: yup.string()
    .required('Confirm password is required')
    .oneOf([yup.ref('NewPassword')], 'Passwords must match'),
});
