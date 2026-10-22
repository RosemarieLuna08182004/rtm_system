import { ButtonType, FormProps, ProductTable, SFC, ToastType } from "../../../types";
import * as S from '../../../styles'
import { twMerge } from "tailwind-merge";
import { Form, Formik } from "formik";
import { CustomButton, Input, Skeleton } from "../..";
import { productValidator } from "../../../validators";
import SaveIcon from '@mui/icons-material/Save';
import { displayToast } from "../../../utils";
import { useParams } from "react-router-dom";
import { Product } from "../../../shared";
import { useAddProduct, useGetProduct, useUpdateProduct } from "../../../hooks";

export const ProductForm : SFC<FormProps> = ({ClassName, Title = 'NA', IsEdit=false }) => {
    const { Id } = useParams<{ Id?: string }>()
    const { records, loading } = useGetProduct(parseInt(`${Id || 0}`, 10))
    const flag = Id?loading?true:false:false
    const { add } = useAddProduct()
    const { update } = useUpdateProduct()
    
    const initial: ProductTable = {
        Name: records?.Name || "",
        Coins:  records?.Coins || 0,
        Price:  records?.Price || 0
    }

    const handleSubmit = async (values: Product) => {
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
                {!flag?
                <Formik initialValues={initial} onSubmit={handleSubmit} enableReinitialize={true} validateOnMount={true} validationSchema={productValidator} >
                {({ errors, touched, isValid, isSubmitting, handleChange, values, dirty }) => (
                    <Form>
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
                           <S.Divider className=" flex flew-col md:flex-row justify-center gap-2 w-full">
                                <S.Divider className="w-full">
                                    <Input
                                        ClassName="text-zinc-900 mb-3 h-[40px]"
                                        errors={errors}
                                        type="number"
                                        disabled={IsEdit}
                                        value={String(Number(values.Coins))}
                                        label="Coins"
                                        name="Coins"
                                        touched={touched}
                                        onChange={handleChange}
                                    />
                                </S.Divider> 
                                <S.Divider className="w-full">
                                    <Input
                                        ClassName="text-zinc-900 mb-3 h-[40px]"
                                        errors={errors}
                                        type="text"
                                        disabled={IsEdit}
                                        value={String(Number(values.Price))}
                                        label="Price"
                                        name="Price"
                                        touched={touched}
                                        onChange={handleChange}
                                    />
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