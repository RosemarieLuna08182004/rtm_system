import { ButtonType, ChapterTable, FormProps, SFC, ToastType } from "../../../types";
import { UnsavedChangesGuard } from "../../../context";
import * as S from '../../../styles'
import { twMerge } from "tailwind-merge";
import { Form, Formik } from "formik";
import { CustomButton, Input, Skeleton, SectionHeader } from "../..";
import { chapterValidator } from "../../../validators";
import SaveIcon from '@mui/icons-material/Save';
import { displayToast } from "../../../utils";
import { useParams } from "react-router-dom";
import { Chapter } from "../../../shared";
import { useAddChapter, useGetChapter, useUpdateChapter } from "../../../hooks";

export const ChapterForm : SFC<FormProps> = ({ClassName, Title = 'NA', Description, IsEdit=false, OnSaved }) => {
    const { Id } = useParams<{ Id?: string }>()
    const { records, loading } = useGetChapter(parseInt(`${Id || 0}`, 10))
    const flag = Id?loading?true:false:false
    const { add } = useAddChapter()
    const { update } = useUpdateChapter()
    
    const initial: ChapterTable = {
        Title: records?.Title || "",
    }

    const handleSubmit = async (values: Chapter) => {
        try {
            if (!Id || !Id.trim()) await add(values)
            else if (await update( Id, values)) OnSaved?.()
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
                <Formik initialValues={initial} onSubmit={handleSubmit} enableReinitialize={true} validateOnMount={true} validationSchema={chapterValidator} >
                    {({ errors, touched, isValid, isSubmitting, handleChange, values, dirty }) => (
                        <Form>
                            {/* Warn before leaving with unsaved changes (not while a save is in progress) */}
                            <UnsavedChangesGuard When={dirty && !isSubmitting} />
                            <S.Divider className="flex flex-col w-full ml-1">
                                <S.Divider className="w-full">
                                    <Input
                                        ClassName="text-zinc-900 mb-3 h-[40px]"
                                        errors={errors}
                                        type="text"
                                        disabled={IsEdit}
                                        value={values.Title}
                                        label="Title"
                                        name="Title"
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