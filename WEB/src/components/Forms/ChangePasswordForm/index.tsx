import * as yup from 'yup';
import { UnsavedChangesGuard } from "../../../context";
import { Form, Formik, FormikHelpers } from "formik";
import { twMerge } from "tailwind-merge";
import LockResetIcon from '@mui/icons-material/LockReset';
import { ButtonType, SFC } from "../../../types";
import * as S from '../../../styles'
import { CustomButton, Input, SectionHeader } from "../..";
import { useChangePassword } from "../../../hooks";

interface PasswordFields {
    CurrentPassword: string
    NewPassword: string
    ConfirmPassword: string
}

const initial: PasswordFields = { CurrentPassword: '', NewPassword: '', ConfirmPassword: '' }

const validator = yup.object().shape({
    CurrentPassword: yup.string().required('Enter your current password'),
    NewPassword: yup.string()
        .min(8, 'Use at least 8 characters')
        .notOneOf([yup.ref('CurrentPassword')], 'Choose a different password from the current one')
        .required('Enter a new password'),
    ConfirmPassword: yup.string()
        .oneOf([yup.ref('NewPassword')], "The passwords don't match")
        .required('Type the new password again'),
})

/** Changes the logged-in user's own password (Profile page). */
export const ChangePasswordForm: SFC = ({ ClassName }) => {
    const { loading, changePassword } = useChangePassword()

    const handleSubmit = async (values: PasswordFields, { resetForm }: FormikHelpers<PasswordFields>) => {
        // Clear the fields once it's done so the passwords don't linger on screen
        if (await changePassword(values.CurrentPassword, values.NewPassword)) resetForm()
    }

    return (
        <S.Container className={twMerge('w-full py-3', ClassName)}>
            <S.Divider className="mb-4">
                <SectionHeader Title="Change password" Description="Enter your current password, then the new one twice. At least 8 characters; longer is safer." />
            </S.Divider>
            <Formik initialValues={initial} onSubmit={handleSubmit} validationSchema={validator}>
                {({ errors, touched, isValid, isSubmitting, handleChange, values, dirty }) => (
                    <Form>
                        {/* Warn before leaving with unsaved changes (not while a save is in progress) */}
                        <UnsavedChangesGuard When={dirty && !isSubmitting} />
                        <S.Divider className="flex flex-col md:flex-row gap-2 w-full ml-1">
                            <S.Divider className="w-full">
                                <Input ClassName="text-zinc-900 mb-3 h-[40px]" errors={errors} touched={touched} type="password"
                                    label="Current password" name="CurrentPassword" value={values.CurrentPassword} onChange={handleChange} />
                            </S.Divider>
                            <S.Divider className="w-full">
                                <Input ClassName="text-zinc-900 mb-3 h-[40px]" errors={errors} touched={touched} type="password"
                                    label="New password" name="NewPassword" value={values.NewPassword} onChange={handleChange} />
                            </S.Divider>
                            <S.Divider className="w-full">
                                <Input ClassName="text-zinc-900 mb-3 h-[40px]" errors={errors} touched={touched} type="password"
                                    label="Confirm new password" name="ConfirmPassword" value={values.ConfirmPassword} onChange={handleChange} />
                            </S.Divider>
                        </S.Divider>
                        <S.Divider className="border-t py-2 flex justify-end">
                            <CustomButton icon={<LockResetIcon className="md:text-white text-primary" />} text="Change password" type={ButtonType.submit}
                                disabled={!dirty || !isValid || isSubmitting || loading} />
                        </S.Divider>
                    </Form>
                )}
            </Formik>
        </S.Container>
    )
}
