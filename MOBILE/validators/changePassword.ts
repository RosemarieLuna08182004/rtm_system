import * as yup from 'yup';

export const changePassValidator = yup.object().shape({
  CurrentPass: yup.string()
    .required('Current Password is required')
    .min(6, 'Password must be at least 6 characters long'),
  NewPassword: yup.string()
    .required('New Password is required')
    .min(6, 'Password must be at least 6 characters long'),
  ConfirmPassword: yup.string()
    .required('Confirm password is required')
    .oneOf([yup.ref('NewPassword'), null], 'Passwords must match')
    .min(6, 'Password must be at least 6 characters long'),
});
