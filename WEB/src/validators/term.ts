import * as yup from 'yup'

export const termValidator = () => {
    return yup.object().shape({
        ChapterId: yup.number().integer().positive().required('Chapter is required'),
        Term: yup.string().matches(/^[A-Za-z\s,.'-/]+$/).required('Term is required'),
        Focus: yup.string().nullable().optional(),
        Definition: yup.string().nullable().optional(),
        Illustration: yup.string().nullable().optional(),
        VoiceOver: yup.string().nullable().optional(),
    });
};

export const subtermValidator = () => {
    return yup.object().shape({
        TermId: yup.number().integer().positive().required('Term is required'),
        CategoryId: yup.number().integer().positive().required('Category is requried'),
        Term: yup.string().matches(/^[A-Za-z\s,.'-/]+$/).nullable().optional(),
        Description: yup.string().nullable().optional(),
        Position: yup.number().integer().positive().required(),
        IsBorderLeft: yup.boolean().optional(),
        Illustration: yup.string().nullable().optional(),
    });
};