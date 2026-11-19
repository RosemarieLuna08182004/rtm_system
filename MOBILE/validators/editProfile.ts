import * as yup from 'yup';

export const editProfileValidator = yup.object().shape({
  Name: yup.string()
    .required('Name is required'),
  Email: yup.string()
    .required('Email is required')
    .email('Enter a valid email address'),
  Country: yup.string()
    .required('Please choose your country'),
});
