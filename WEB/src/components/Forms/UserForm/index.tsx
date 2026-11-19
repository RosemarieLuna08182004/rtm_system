import { ButtonType, FormProps, Roles, SFC, ToastType, UserTable } from "../../../types";
import { UnsavedChangesGuard } from "../../../context";
import * as S from '../../../styles'
import { twMerge } from "tailwind-merge";
import { Form, Formik } from "formik";
import { CustomButton, Input, SelectInput, Skeleton, SectionHeader } from "../..";
import { userValidator, userValidatorOnUpdate } from "../../../validators";
import SaveIcon from '@mui/icons-material/Save';
import { displayToast } from "../../../utils";
import { useParams } from "react-router-dom";
import { accountTypeOpt, User } from "../../../shared";
import { COUNTRIES, countryFlag } from "../../../shared/data/countries";

const countryOpt = COUNTRIES.map(c => ({ value: c.Code, label: `${countryFlag(c.Code)} ${c.Name}` }));
import { useAddUser, useAuth, useGetUser, useUpdateUser, } from "../../../hooks";

export const UserForm : SFC<FormProps> = ({ClassName, Title = 'NA', Description, IsEdit=false, ViewOnly=false }) => {
    const { Id } = useParams<{ Id?: string }>()
    const { records, loading, refetch } = useGetUser(parseInt(`${Id || 0}`, 10))
    const flag = Id?loading?true:false:false
    const { auth, setAuth } = useAuth()

    const { add } = useAddUser()
    const { update } = useUpdateUser()
    // Editing an existing user: password is optional (it isn't shown here; see Change password)
    const validator = Id ? userValidatorOnUpdate : userValidator
    const initial: UserTable = {
        AccountType: records?.AccountType || Roles.default,
        Name:  records?.Name || "",
        Email:  records?.Email || "",
        Country: records?.Country || "",
        GoogleId: null,
        Password: "",
        ProfilePhoto: null,
        AccessToken: null
    }

    const handleSubmit = async (values: User) => {
        try {
            if (!Id || !Id.trim()) { await add(values); return }
            // Only what can change: the server refuses AccountType and empty passwords on update
            const changes = { Name: values.Name.trim(), Email: values.Email.trim() }
            if (!(await update(Number(Id), changes))) return
            // Keep the top bar's name in step when you edit your own profile
            if (String(auth?.user?.Id) === String(Id))
                setAuth(prev => ({ ...prev, user: { ...prev.user, ...changes } }))
            refetch()
        } catch (error: any) {
            displayToast(error.message, ToastType.error)
        }
    }

    return (
        <>
            <S.Container className={twMerge(' w-full py-3 ', ClassName)}>
                <S.Divider className=" mb-4">
                    <SectionHeader Title={Title} Description={Description} />
                </S.Divider>
                <S.Content>
                {!flag?
                <Formik initialValues={initial} onSubmit={handleSubmit} enableReinitialize={true} validateOnMount={true} validationSchema={validator} >
                {({ errors, touched, isValid, isSubmitting, handleChange, values, dirty }) => (
                    <Form>
                        {/* Warn before leaving with unsaved changes (not while a save is in progress) */}
                        <UnsavedChangesGuard When={dirty && !isSubmitting} />
                        <S.Divider className="flex flex-col w-full ml-1">
                            <S.Divider className="w-full md:w-1/2">
                                <SelectInput errors={errors} label={"Account Type"} name={"AccountType"} touched={touched} options={accountTypeOpt} disabled={(IsEdit || !!Id?.trim())}/>
                            </S.Divider> 
                            <S.Divider className="w-full">
                                    <Input
                                        ClassName="text-zinc-900 mb-3 h-[40px]"
                                        errors={errors}
                                        type="text"
                                        disabled={IsEdit}
                                        value={values.Name}
                                        label="Name"
                                        name="Name"
                                        touched={touched}
                                        onChange={handleChange}
                                    />
                                </S.Divider> 
                           <S.Divider className="w-full flex flew-col md:flex-row gap-2">
                                <S.Divider className="w-full">
                                    <Input
                                        ClassName="text-zinc-900 mb-3 h-[40px]"
                                        errors={errors}
                                        type="email"
                                        disabled={IsEdit}
                                        value={values.Email}
                                        label="Email"
                                        name="Email"
                                        touched={touched}
                                        onChange={handleChange}
                                    />
                                </S.Divider> 
                                {!Id && <S.Divider className="w-full">
                                    <Input
                                        ClassName="text-zinc-900 mb-3 h-[40px]"
                                        errors={errors}
                                        type="password"
                                        disabled={IsEdit}
                                        value={values.Password}
                                        label="Password"
                                        name="Password"
                                        touched={touched}
                                        onChange={handleChange}
                                    />
                                </S.Divider> }
                           </S.Divider>
                            {/* Set at sign-up; existing accounts show "Not set" until the user picks one in the app */}
                            <S.Divider className="w-full md:w-1/2">
                                <SelectInput errors={errors} label={"Country"} name={"Country"} touched={touched} options={countryOpt}
                                    placeholder={Id ? "Not set" : "Select a country"} disabled={IsEdit || !!Id?.trim()}/>
                            </S.Divider>
                        </S.Divider>
                        {!ViewOnly && (
                            <S.Divider className="border-t py-2 flex justify-end">
                                <CustomButton icon={<SaveIcon className="md:text-white text-primary" />}  disabled={!dirty || !isValid || isSubmitting || IsEdit} text="Save" type={ButtonType.submit}/>
                            </S.Divider>
                        )}
                    </Form>
                )}
            </Formik>:<Skeleton/>}
                </S.Content>
            </S.Container>
        </>
    )
}