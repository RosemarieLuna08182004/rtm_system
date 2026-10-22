import { ButtonType, FormProps, SFC, TermTable, ToastType } from "../../../types";
import * as S from '../../../styles'
import { twMerge } from "tailwind-merge";
import { Form, Formik } from "formik";
import { CustomButton, Input } from "../..";
import { termValidator } from "../../../validators";
import SaveIcon from '@mui/icons-material/Save';
import { displayToast } from "../../../utils";
import { useParams } from "react-router-dom";
import { useAddTerm, useGetAllChapter, useGetChapter, useGetTerm, useUpdateTerm } from "../../../hooks";
import { colors } from "../../../styles";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { Term } from "../../../shared";
import { useState } from "react";
import { axiosPrivate } from '../../../shared/api';

// Utility to safely render only strings
function safeString(val: any): string {
    if (typeof val === 'string') return val;
    if (val && typeof val.message === 'string') return val.message;
    try {
        return JSON.stringify(val);
    } catch {
        return '';
    }
}

export const TermForm: SFC<FormProps> = ({ ClassName, Title = 'NA', IsEdit = false }) => {
    const { Id } = useParams<{ Id?: string }>();
    const termIdNum = Number(Id);
    const hasValidId = !isNaN(termIdNum) && termIdNum > 0;
    const { records, loading } = useGetTerm(hasValidId ? termIdNum : 0)
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
   
    const { add } = useAddTerm()
    const { update } = useUpdateTerm()
    const { records: options, } = useGetAllChapter()
    
    const initial: TermTable = {
    ChapterId: records?.ChapterId ?? 0,
    Term: records?.Term ?? null,
    Focus: null,
    Definition: null,
    Illustration: typeof records?.Illustration === 'string' ? records.Illustration : '',
    VoiceOver: typeof records?.VoiceOver === 'string' ? records.VoiceOver : ''
}
    const { records: ChapterTitle, loading:ChapterTitleLoad } = useGetChapter(records?.ChapterId || 0)
    const flag = Id?loading&&ChapterTitleLoad?true:false:false
    //console.log("initial:",initial)
    const handleSubmit = async (values: Term) => {
        try {
            values.Focus = values?.Focus?.trim() || null;
            console.log(values)
            if (!Id || !Id.trim()) await add(values)
            else await update(Id, values)
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
                    {!flag ? (
                        <Formik initialValues={initial} onSubmit={handleSubmit} enableReinitialize={true} validateOnMount={true} validationSchema={termValidator}>
                            {({ errors, touched, isValid, isSubmitting, handleChange, values, dirty, setFieldValue, setTouched }) => (
                                <Form>
                                <S.Divider className="flex flex-col w-full ml-1">
                                    {/*<S.Divider className="w-full flex flex-col md:flex-row gap-2">
                                        <S.Divider className="w-full flex flex-col">
                                            <S.Label className="mb-2">Volume</S.Label>
                                            <S.Divider>
                                                <Autocomplete
                                                    id="combo-box"
                                                    options={options}
                                                    getOptionLabel={(option) => option.Title || ''}
                                                    value={options.find(option => option.Id === values.ChapterId) || null}
                                                    onChange={(_, value) => {
                                                        setFieldValue('ChapterId', value?.Id || 0);
                                                        setTouched({ ChapterId: true });
                                                    }}
                                                    disabled={IsEdit}
                                                    isOptionEqualToValue={(option, value) => option.Id === value.Id}
                                                    className="comboBox w-full"
                                                    renderInput={(params) => <TextField {...params} placeholder="Select Volume" />}
                                                    sx={{ width: '100%', background: IsEdit?'white':colors.palette.neutral['075'], height: '40px !important', alignItems: 'center', display: 'flex', borderRadius: '3px', marginBottom: '10px',transition: 'all 0.3s', border: IsEdit?`1px solid ${colors.palette.neutral['100']}`:'', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' }, }  }}
                                                />
                                            </S.Divider>
                                        </S.Divider>
                                        <S.Divider className="w-full ">
                                                <Input
                                                    ClassName="text-zinc-900 mb-3 h-[40px]"
                                                    errors={errors}
                                                    type="number"
                                                    disabled={IsEdit}
                                                    value={String(Number(values.Coins).toFixed(2))}
                                                    label="Coins"
                                                    name="Coins"
                                                    touched={touched}
                                                    onChange={handleChange}
                                                />
                                        </S.Divider>  
                                    </S.Divider>*/}
                                    <S.Divider className="w-full flex flex-col md:flex-row gap-2">
                                        <S.Divider className="w-full flex flex-col md:w-1/2">
                                            <S.Label className="mb-2">Volume</S.Label>
                                            <S.Divider>
                                            <Autocomplete
                                                    id="combo-box"
                                                    options={options}
                                                    getOptionLabel={(option) => option.Title || 'NA'}
                                                    value={options.find(option => option.Id === values.ChapterId) || null}
                                                    onInputChange={(_, _value) => ChapterTitle} // Fetch options dynamically
                                                    onChange={(_, value) => {
                                                        setFieldValue('ChapterId', value?.Id || 0);
                                                        setTouched({ ChapterId: true });
                                                    }}
                                                    disabled={IsEdit}
                                                    isOptionEqualToValue={(option, value) => option.Id === value.Id}
                                                    className="comboBox w-full"
                                                    renderInput={(params) => <TextField {...params} placeholder="Select Volume" />}
                                                    sx={{ width: '100%', background: IsEdit ? 'white' : colors.palette.neutral['075'], height: '40px !important', alignItems: 'center', display: 'flex', borderRadius: '3px', marginBottom: '10px', transition: 'all 0.3s', border: IsEdit ? `1px solid ${colors.palette.neutral['100']}` : '', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' }, } }}
                                                />
                                            </S.Divider>
                                        </S.Divider>
                                        <S.Divider className="w-full md:w-1/2">
                                            <Input
                                                ClassName="text-zinc-900 mb-3 h-[40px]"
                                                errors={errors}
                                                type="text"
                                                disabled={IsEdit}
                                                value={values.Term??""}
                                                label="Heading Term"
                                                name="Term"
                                                touched={touched}
                                                onChange={handleChange}
                                            />
                                        </S.Divider>
                                        {/*<S.Divider className="w-full md:w-1/2">
                                            <Input
                                                ClassName="text-zinc-900 mb-3 h-[40px]"
                                                errors={errors}
                                                type="text"
                                                disabled={IsEdit}
                                                value={String(values.Focus??'')}
                                                label="Word Focus"
                                                name="Focus"
                                                touched={touched}
                                                onChange={handleChange}
                                            />
                                        </S.Divider>*/}
                                    </S.Divider>
                                    {/*<S.Divider className="w-full flex flex-col h-full md:h-[350px] ">
                                        <S.Label className="mb-2">Definition</S.Label>
                                        <S.Divider className={`${IsEdit?'':'bg-slate-100'} md:h-[295px] `}>
                                            <TextEditor ref={quillRef} value={values.Definition} isEdit={IsEdit} onChange={(_content, _delta, _source, editor) => {
                                                setFieldValue('Definition', editor.getHTML());
                                                setTouched({ Definition: true });
                                            }}/>
                                        </S.Divider>
                                        {errors.Definition && touched.Definition ? (
                                            <div className="error-message text-red-500 text-sm">{errors.Definition}</div>
                                        ) : null}
                                    </S.Divider>*/}
                                </S.Divider>
                                <S.Divider className="w-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Illustration
                                    </label>
                                    <div className="mt-1 flex flex-col md:flex-row items-start md:items-center gap-2">
                                        <input
                                            id="illustration-upload"
                                            name="illustration"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            disabled={isUploading || !hasValidId}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                
                                                if (!hasValidId) {
                                                    displayToast(
                                                        'Please save the term first before uploading an image.',
                                                        ToastType.error
                                                    );
                                                    return;
                                                }

                                                setIsUploading(true);
                                                const formData = new FormData();
                                                formData.append('Illustration', file);

                                                try {
                                                    const response = await axiosPrivate.post(`/storage/term/${termIdNum}/illustration`, formData, {
                                                        headers: { 'Content-Type': 'multipart/form-data' },
                                                    });

                                                    const data = response.data;
                                                    console.log('Upload response:', data);
                                                    console.log('data.data.url:', data?.data?.url, typeof data?.data?.url);
                                                    
                                                    if (data && data.data && typeof data.data.url === 'string') {
                                                        setFieldValue('Illustration', data.data.url);
                                                        setPreviewUrl(data.data.url);
                                                        displayToast(
                                                            data.message || 'Image uploaded successfully!',
                                                            ToastType.success
                                                        );
                                                    } else {
                                                        displayToast(
                                                            'Upload failed: invalid URL',
                                                            ToastType.error
                                                        );
                                                    }
                                                } catch (error: any) {
                                                    console.error('Error uploading image:', error);
                                                    displayToast(
                                                        typeof error === 'string' ? error : error?.message || 'Failed to upload image',
                                                        ToastType.error
                                                    );
                                                } finally {
                                                    setIsUploading(false);
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor="illustration-upload"
                                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                                                 (isUploading || !Id) 
                                                     ? 'bg-gray-400 cursor-not-allowed' 
                                                     : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer'
                                             }`}
                                             onClick={(e) => (isUploading || !Id) && e.preventDefault()}
                                        >
                                            {isUploading ? (
                                                <>
                                                    <CircularProgress size={16} color="inherit" className="mr-2" />
                                                    Uploading...
                                                </>
                                            ) : !Id ? (
                                                'Save term first'
                                            ) : values.Illustration ? (
                                                'Change Image'
                                            ) : (
                                                'Upload Image'
                                            )}
                                         </label>
{/* Preview & filename */}
{(() => {
     // Only display file name / preview if url exists
    if (typeof values.Illustration === 'string' && values.Illustration.trim() && !isUploading) {
        let fileName = '';
        try {
            fileName = decodeURIComponent(values.Illustration.split('/').pop() || '');
        } catch {
            fileName = values.Illustration;
        }
        return (
            <div className="ml-4 flex items-center">
                <span className="text-sm text-gray-700 font-mono truncate max-w-[200px]" title={fileName}>{fileName}</span>
                <button
                    type="button"
                    className="ml-2 text-red-600 hover:text-red-800 text-sm"
                    onClick={async () => {
                        if (!Id) return;
                        try {
                            await axiosPrivate.delete(`/storage/term/${termIdNum}/illustration`);
                            setFieldValue('Illustration', '');
                            setPreviewUrl('');
                            displayToast('Image removed.', ToastType.success);
                        } catch (err:any) {
                            displayToast(
                                err?.message || 'Failed to delete image',
                                ToastType.error
                            );
                        }
                    }}
                    disabled={isUploading}
                >
                    Remove
                </button>
                {previewUrl && (
                    <img src={previewUrl} alt="preview" className="h-16 w-16 object-cover ml-4 rounded" />
                )}
            </div>
        );
    }
    return null;
})()}

                                    </div>
                                    {(() => {
    // Debug log
    
    return errors.Illustration && touched.Illustration ? (
        <p className="mt-1 text-sm text-red-600">
            {safeString(errors.Illustration) || 'Invalid image'}
        </p>
    ) : null;
})()}

                                </S.Divider>
                                <S.Divider className="w-full">
                                    <Input
                                        ClassName="text-zinc-900 mb-3 h-[40px]"
                                        errors={errors}
                                        type="text"
                                        disabled={IsEdit}
                                        value={typeof values.Illustration === 'string' ? values.Illustration : ''}
                                        label="Illustration"
                                        name="Illustration"
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
                                        value={typeof values.VoiceOver === 'string' ? values.VoiceOver : ''}
                                        label="Voice Over"
                                        name="VoiceOver"
                                        touched={touched}
                                        onChange={handleChange}
                                    />
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
                    </Formik>
                    ) : null}
        </S.Content>
            </S.Container>
        </>
    )
}
