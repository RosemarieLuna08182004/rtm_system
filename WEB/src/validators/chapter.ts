import * as yup from 'yup'

export const chapterValidator = () => {
    return yup.object().shape({
        Title: yup.string().matches(/^[A-Za-z\s\-]+$/).required('Title is required'),
        Coins: yup.number().integer().required(),
    });
};