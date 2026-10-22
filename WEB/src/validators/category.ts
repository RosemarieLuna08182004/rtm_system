import * as yup from 'yup'

export const categoryValidator = () => {
    return yup.object().shape({
        Id: yup.string().nullable().optional(),
        Category: yup.string().required('Category is required'),
        Description: yup.string().required('Description is required')
    });
};