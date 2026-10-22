import { ButtonType, FormProps, SFC, TermLineTable, ToastType } from "../../../types";
import * as S from '../../../styles'
import { twMerge } from "tailwind-merge";
import { Form, Formik } from "formik";
import { CustomButton, Input, SelectInput, Skeleton, TextEditor } from "../..";
import { subtermValidator } from "../../../validators";
import SaveIcon from '@mui/icons-material/Save';
import { displayToast } from "../../../utils";
import { useParams } from "react-router-dom";
import { useAddTermLine, useGetAllCategory, useGetAllTerm, useGetCategory, useGetTermLine, useUpdateTermLine } from "../../../hooks";
import { colors } from "../../../styles";
import { Autocomplete, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { TermLine, positionOpt } from "../../../shared";
import ReactQuill from "react-quill";
import { useRef } from "react";

export const SubTermForm: SFC<FormProps> = ({ ClassName, Title = 'NA', IsEdit = false, IsDetails=true }) => {
    const { Id } = useParams<{ Id?: string }>()

    const { records, loading } = useGetTermLine(parseInt(`${Id || 0}`, 10))
   
    const { add } = useAddTermLine()
    const { update } = useUpdateTermLine()
    const { records: termOpt } = useGetAllTerm()
    const { records: categoryOpt } = useGetAllCategory()
    const { records: CategoryTitle,loading:CategoryTitleLoading } = useGetCategory(records?.CategoryId ?? 0)
    const quillRef = useRef<ReactQuill>(null);
    const flag = Id?loading&&CategoryTitleLoading?true:false:false

    const initial: TermLineTable = {
        TermId: records?.TermId ?? 0,
        CategoryId: records?.CategoryId ?? 0,
        Term: records?.Term ?? null,
        Description: records?.Description ?? null,
        Position: records?.Position ?? 0,
        IsBorderLeft: records?.IsBorderLeft === true? true : false,
        Illustration: records?.Illustration ?? null
    }
    
    const termlineInitial: TermLineTable = {
        TermId: Number(Id) ?? 0,
        CategoryId: 0,
        Term: null,
        Description: null,
        Position: 0,
        IsBorderLeft: false,
        Illustration: null,
    }
    
    let optionalInitial = IsDetails?initial: termlineInitial
    
    const handleSubmit = async (values: TermLine) => {
        try {
            if ((Id) && IsDetails) await update(Id, values)
            else await add(values)
        } catch (error: any) {
            console.log(error)
            displayToast(error?.response?.data?.message || error.message, ToastType.error)
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
                    <Formik initialValues={optionalInitial} onSubmit={handleSubmit} enableReinitialize={true} validateOnMount={true} validationSchema={subtermValidator}>
                        {({ errors, touched, isValid, isSubmitting, handleChange, values, dirty, setFieldValue, setTouched }) => (
                            <Form>
                                <S.Divider className="flex flex-col w-full ml-1">
                                    <S.Divider className="w-full flex flex-col md:flex-row gap-2">
                                        <S.Divider className="w-full md:w-1/2 flex flex-col">
                                            <S.Label className="mb-2">Term</S.Label>
                                            <S.Divider>
                                            <Autocomplete
                                                   id="combo-box"
                                                   options={termOpt}
                                                   getOptionLabel={(option) => option.Term || ''}
                                                   value={termOpt.find(option => option.Id === values.TermId) || null}
                                                   onInputChange={(_, _value) => CategoryTitle}
                                                   onChange={(_, value) => {
                                                       setFieldValue('TermId', value?.Id || 0);
                                                       setTouched({ TermId: true });
                                                   }}
                                                   disabled={IsEdit || !IsDetails}
                                                   isOptionEqualToValue={(option, value) => option.Id === value.Id}
                                                   className="comboBox w-full"
                                                   renderInput={(params) => <TextField {...params} placeholder="Select Volume" />}
                                                   sx={{ width: '100%', background: IsEdit?'white':colors.palette.neutral['075'], height: '40px !important', alignItems: 'center', display: 'flex', borderRadius: '3px', marginBottom: '10px',transition: 'all 0.3s', border: IsEdit?`1px solid ${colors.palette.neutral['100']}`:'', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' }, }  }}
                                                />
                                            </S.Divider>
                                        </S.Divider>
                                         <S.Divider className="w-full md:w-1/2 flex flex-col">
                                            <SelectInput errors={errors} label="Position" disabled={IsEdit} placeholder="Select position" name="Position" touched={touched} options={positionOpt} />
                                        </S.Divider>
                                    </S.Divider>
                                    <S.Divider className="w-full flex md:flex-row flex-col gap-2">
                                        <S.Divider className="w-full md:w-1/2 flex flex-col">
                                            <Input
                                                ClassName="text-zinc-900 mb-3 h-[40px]"
                                                errors={errors}
                                                type="text"
                                                disabled={IsEdit}
                                                value={values?.Term?? ''}
                                                label="Sub Term"
                                                name="Term"
                                                touched={touched}
                                                onChange={handleChange}
                                            />
                                        </S.Divider>
                                            <S.Divider className="w-full md:w-1/2 flex flex-col">
                                                <S.Label className="mb-2">Category</S.Label>
                                                <S.Divider>
                                                    <Autocomplete
                                                        id="combo-box2"
                                                        options={categoryOpt}
                                                        getOptionLabel={(option) => option.Category || ''}
                                                        value={categoryOpt.find(option => option.Id === values.CategoryId) || null}
                                                        onChange={(_, value) => {
                                                            setFieldValue('CategoryId', value?.Id || 0);
                                                            setTouched({ CategoryId: true });
                                                        }}
                                                        disabled={IsEdit}
                                                        isOptionEqualToValue={(option, value) => option.Id === value.Id} 
                                                        className="comboBox w-full"
                                                        renderInput={(params) => <TextField {...params} placeholder="Select Category" />}
                                                        sx={{ width: '100%', background: IsEdit?'white':colors.palette.neutral['075'], height: '40px !important', alignItems: 'center', display: 'flex', borderRadius: '3px', marginBottom: '10px',transition: 'all 0.3s', border: IsEdit?`1px solid ${colors.palette.neutral['100']}`:'', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' }, }  }}
                                                    />
                                            </S.Divider>
                                        </S.Divider>
                                    </S.Divider>
                                    <S.Divider className="w-full flex">
                                    <FormControlLabel
                                            control={
                                                <Checkbox
                                                    size="small"
                                                    checked={values.IsBorderLeft}
                                                    onChange={(event) => {
                                                        setFieldValue('IsBorderLeft', event.target.checked);
                                                        setTouched({ IsBorderLeft: true });
                                                    }}
                                                    disabled={IsEdit}
                                                />
                                            }
                                            label="Border Left"
                                            name ="IsBorderLeft"
                                            sx={{
                                                '& .MuiFormControlLabel-label': {
                                                    fontSize: '13px',
                                                    fontFamily: '',
                                                    color: '#3f3f3f', 
                                                    alignItems: 'center',
                                                    display: 'flex',
                                                    
                                                },
                                            }}
                                        />
                                    </S.Divider>
                                    <S.Divider className="w-full flex flex-col h-full mb-3 md:h-[350px] ">
                                        <S.Label className="mb-2">Description</S.Label>
                                        <S.Divider className={`${IsEdit?'':'bg-slate-100'} md:h-[295px]`}>
                                            <TextEditor ref={quillRef} value={values?.Description??""} isEdit={IsEdit} onChange={(_content, _delta, _source, editor) => {
                                                setFieldValue('Description', editor.getHTML());
                                                setTouched({ Description: true });
                                            }}/>
                                        </S.Divider>
                                        {errors.Description && touched.Description ? (
                                            <div className="error-message text-red-500 text-sm">{errors.Description}</div>
                                        ) : null}
                                    </S.Divider>
                                    <S.Divider className="w-full">
                                        <Input
                                            ClassName="text-zinc-900 mb-3 h-[40px]"
                                            errors={errors}
                                            type="text"
                                            disabled={IsEdit}
                                            value={values.Illustration??""}
                                            label="Illustration"
                                            name="Illustration"
                                            touched={touched}
                                            onChange={handleChange}
                                        />
                                    </S.Divider>
                                </S.Divider>
                                <S.Divider className="border-t py-2 flex justify-end">
                                    <CustomButton
                                        icon={<SaveIcon className="text-primary md:text-white" />}
                                        disabled={!dirty || !isValid || isSubmitting || IsEdit}
                                        text="Save"
                                        type={ButtonType.submit}
                                        morph={true}
                                    />
                                </S.Divider>
                            </Form>
                        )}
                    </Formik>:<Skeleton/>}
                </S.Content>
            </S.Container>
        </>
    )
}