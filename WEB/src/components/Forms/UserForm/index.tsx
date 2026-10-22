import { ButtonType, FormProps, Roles, SFC, ToastType, UserTable } from "../../../types";
import * as S from '../../../styles'
import { twMerge } from "tailwind-merge";
import { Form, Formik } from "formik";
import { CustomButton, Input, SelectInput, Skeleton } from "../..";
import { userValidator } from "../../../validators";
import SaveIcon from '@mui/icons-material/Save';
import { displayToast } from "../../../utils";
import { useParams } from "react-router-dom";
import { accountTypeOpt, User } from "../../../shared";
import { useAddUser, useGetUser, useUpdateUser, } from "../../../hooks";

export const UserForm : SFC<FormProps> = ({ClassName, Title = 'NA', IsEdit=false }) => {
    const { Id } = useParams<{ Id?: string }>()
    const { records, loading } = useGetUser(parseInt(`${Id || 0}`, 10))
    const flag = Id?loading?true:false:false

    const { add } = useAddUser()
    const { update } = useUpdateUser()
    const initial: UserTable = {
        AccountType: records?.AccountType || Roles.default,
        Name:  records?.Name || "",
        Email:  records?.Email || "",
        GoogleId: null,
        Password: "",
        ProfilePhoto: null,
        AccessToken: null
    }

    const handleSubmit = async (values: User) => {
        try {
            if (!Id || !Id.trim()) await add(values)
            else await update(Number(Id), values)
        } catch (error: any) {
            displayToast(error.message, ToastType.error)
        }
    }

    return (
        <>
            <S.Container className={twMerge(' w-full py-3 ', ClassName)}>
                <S.Divider className=" mb-4">
                    <S.Span className="text-xl text-slate-600">{Title}</S.Span>
                </S.Divider>
                <S.Content>
                {!flag?
                <Formik initialValues={initial} onSubmit={handleSubmit} enableReinitialize={true} validateOnMount={true} validationSchema={userValidator} >
                {({ errors, touched, isValid, isSubmitting, handleChange, values, dirty }) => (
                    <Form>
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
                        </S.Divider>
                        <S.Divider className="border-t py-2 flex justify-end">
                            <CustomButton icon={<SaveIcon className="md:text-white text-primary" />}  disabled={!dirty || !isValid || isSubmitting || IsEdit} text="Save" type={ButtonType.submit}/>
                        </S.Divider>
                    </Form>
                )}
            </Formik>:<Skeleton/>}
                </S.Content>
            </S.Container>
        </>
    )
}