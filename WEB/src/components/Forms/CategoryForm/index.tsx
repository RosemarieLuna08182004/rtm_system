import { ButtonType, CategoryTable, FormProps, SFC, ToastType } from "../../../types";
import * as S from '../../../styles'
import { twMerge } from "tailwind-merge";
import { Form, Formik } from "formik";
import { CustomButton, Input, Skeleton } from "../..";
import { categoryValidator } from "../../../validators";
import SaveIcon from '@mui/icons-material/Save';
import { displayToast } from "../../../utils";
import { useParams } from "react-router-dom";
import { useAddCategory, useGetCategory, useUpdateCategory } from "../../../hooks";
import { Category } from "../../../shared";

export const CategoryForm : SFC<FormProps> = ({ClassName, Title = 'NA', IsEdit=false }) => {
    const { Id } = useParams<{ Id?: string }>()
    const { records: category, loading } = useGetCategory(parseInt(`${Id || 0}`, 10))
    const flag = Id?loading?true:false:false
    const { add } = useAddCategory()
    const { update } = useUpdateCategory()
    
    const categoryInitial: CategoryTable = {
        Category: category?.Category || "",
        Description: category?.Description || ""
    }

    const handleSubmit = async (values: Category) => {
        try {
            if (!Id || !Id.trim()) await add(values)
            else await update( Id, values)
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
                {!flag?  (
                    <>
                    <Formik initialValues={categoryInitial} onSubmit={handleSubmit} enableReinitialize={true} validateOnMount={true} validationSchema={categoryValidator} >
                        {({ errors, touched, isValid, isSubmitting, handleChange, values, dirty }) => (
                        
                        <Form>
                            <S.Divider className="flex flex-col w-full ml-1">
                                <S.Divider className="w-full">
                                    <Input
                                        ClassName="text-zinc-900 mb-3 h-[40px]"
                                        errors={errors}
                                        type="text"
                                        disabled={IsEdit}
                                        value={values.Category}
                                        label="Category"
                                        name="Category"
                                        touched={touched}
                                        onChange={handleChange}
                                    />
                                </S.Divider> 
                                <S.Divider>
                                    <Input
                                        ClassName="text-zinc-900 mb-3 w-full"
                                        errors={errors}
                                        type="text"
                                        disabled={IsEdit}
                                        value={values.Description}
                                        label="Description"
                                        name="Description"
                                        touched={touched}
                                        onChange={handleChange}
                                    />
                                </S.Divider>
                            </S.Divider>
                            <S.Divider className="border-t py-2 flex justify-end">
                                <CustomButton icon={<SaveIcon className="text-primary md:text-white" />}  disabled={!dirty || !isValid || isSubmitting || IsEdit} text="Save" type={ButtonType.submit}/>
                            </S.Divider>
                        </Form>
                        )}
                    </Formik>
                </>)
                :<Skeleton/>} 
                </S.Content>
            </S.Container>
        </>
    )
}