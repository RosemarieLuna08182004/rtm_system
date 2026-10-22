import * as yup from 'yup';
import { Roles } from '../types'; // assuming Roles is an enum or array of possible role values

export const userValidator = () => {
  return yup.object().shape({
    AccountType: yup.mixed().oneOf(Object.values(Roles)).required('AccountType is required'),
    Name: yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Name must only contain letters and spaces')
      .required('Name is required'),
    Email: yup.string().email('Invalid email format').required('Email is required'),
    Password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });
};


export const userValidatorOnUpdate = () => {
  return yup.object().shape({
    AccountType: yup.mixed().oneOf(Object.values(Roles)).optional(),
    Name: yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Name must only contain letters and spaces')
      .required('Name is required'),
    Email: yup.string().email('Invalid email format').required('Email is required'),
    Password: yup.string().min(8, 'Password must be at least 8 characters').optional(),
  });
};
