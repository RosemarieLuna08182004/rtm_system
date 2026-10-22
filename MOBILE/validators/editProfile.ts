import * as yup from 'yup';
import { NAME_PATTERN } from './signUp';

export const editProfileValidator = yup.object().shape({
  Name: yup.string()
    .trim()
    .required('Name is required')
    .matches(NAME_PATTERN, "Name can only contain letters, spaces, periods, hyphens and apostrophes"),
  Email: yup.string()
    .trim()
    .required('Email is required')
    .email('Enter a valid email address')
});
