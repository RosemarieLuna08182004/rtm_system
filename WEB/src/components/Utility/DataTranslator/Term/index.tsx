import { twMerge } from "tailwind-merge";
import { useRef, useState } from "react";
import * as S from '../../../../styles'
import InfoIcon from '@mui/icons-material/Info';
import styled from "styled-components";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button } from "@mui/material";
import { ButtonType, SFC, ToastType } from "../../../../types";
import { useAuth } from "../../../../hooks";
import { displayToast, formatDate } from "../../../../utils";
import { CustomButton } from "../../../FormInputs";
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';

export const TermDataTranslator: SFC = ({ ClassName }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);
    const [filename, setFilename] = useState<string>('');
    const [uploadedfile, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const [chapterId, setChapterId] = useState<number>(0);
    const { auth } = useAuth();

    const processFile = () => {
        const fileInput:any = uploadedfile??fileInputRef?.current;
        
        if (!fileInput || fileInput?.length === 0) {
            displayToast("Please select a file.1", ToastType.error);
            return;
        }
    
        if (!chapterId || chapterId === 0) {
            displayToast("ChapterId is required", ToastType.error);
            return;
        }
    
        if (!(fileInput instanceof Blob)) {
            displayToast("The selected file is not valid.", ToastType.error);
            return;
        }
    
        const reader = new FileReader();
        setLoading(true)
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (!content) {
                displayToast("File content is empty", ToastType.error);
                return;
            }
    
            const records = content
                .split("),(")
                .map(line => line.trim())
                .filter(Boolean);
    
            const extractedData = records.map(record => extractFields(record));
            
            const output = extractedData
                .map(({ Term, Focus, Definition }) => `(${chapterId}, ' ${Term??"NA"} ', ' ${Focus??"NA"} ', ' ${Definition??"NA"} ', null, null, ${auth?.user?.Id ?? 0}, '${formatDate(new Date().toUTCString())}', null, null)`)
                .join(",\n");

            const sqlInsert = "INSERT INTO `term`(`ChapterId`, `Term`, `Focus`, `Definition`, `Illustration`, `VoiceOver`, `CreatedBy`, `DateCreated`, `UpdatedBy`, `DateUpdated`) VALUES"
            downloadAsTextFile(`${sqlInsert} ${output}`, "term_script.sql");
        };
    
        reader.onerror = () => {
            displayToast("Failed to read the file", ToastType.error);
        };

        setTimeout(()=>{
            setLoading(false)
        },3000)
        reader.readAsText(fileInput);
        
    };

    const extractFields = (record: string) => {
        const fields = record.match(/'[^']*'|NULL|[^,()]+/g)?.map(field =>
            field.trim().replace(/^'|'$/g, "") 
        );

        const Term = fields?.[1] ?? "";
        const Focus = fields?.[4] ?? "";
        const Definition = fields?.[5] ?? "";

        return { Term, Focus, Definition };
    };

    const downloadAsTextFile = (content: string, filename: string) => {
        const blob = new Blob([content], { type: "text/plain" });
        if (downloadLinkRef.current) {
            downloadLinkRef.current.href = URL.createObjectURL(blob);
            downloadLinkRef.current.download = filename;
            downloadLinkRef.current.style.display = "block";
        }
    };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    return (
        <>
            <S.Container className={twMerge("w-full", ClassName)}>
                <S.Divider className="bg-blue-100 rounded-lg w-full p-3 flex justify-start items-center mb-2">
                    <InfoIcon className="text-primary" /><S.Span className="ml-3">This utility processes old records to align with the new data design. This process is specifically intended for Terms.</S.Span>
                </S.Divider>
                <S.Divider className="w-full">
                    <S.Divider className="flex flex-col justify-start gap-4 items-start w-full">
                        <S.Divider className="flex flex-col md:flex-row items-center w-full gap-2">
                            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} className=" w-full md:w-[200px]  flex items-center justify-center h-10 rounded-md shadow-none" sx={{minWidth: '',  border: 'none', background: S.colors.primary,'&:hover': { background: S.colors.secondary }}}>
                                Upload Files
                                <VisuallyHiddenInput
                                    type="file" ref={fileInputRef}
                                    accept=".txt"
                                    multiple
                                    onChange={(event) => { const files = event.target.files; if (files?.length) {setFilename(files[0]?.name);setFile(files[0]); } else displayToast("No File selected", ToastType.error) }} 
                                />
                            </Button>
                            {filename && (<S.Span className="ml-5 bg-yellow-100 p-2 rounded-lg"> {filename}</S.Span>)}
                        </S.Divider>
                        {filename && <S.Divider className="flex flex-col w-full"><S.Span className="text-primary text-sm">Chapter Id *</S.Span><input className="bg-slate-100 p-2 rounded-md border-b-2 border-blue-700 w-full" type="number" name="ChapterId" onChange={(e) => setChapterId(parseInt(e.target.value))} /></S.Divider>}
                        <S.Divider className="flex flex-row items-center w-full justify-end md:justify-start">
                            <CustomButton icon={<QueryBuilderIcon className="text-white"/>} ClassName="relative w-full " morph={false} text="Process File" onClick={processFile} type={ButtonType.button} disabled={loading}/>
                            <a ref={downloadLinkRef} style={{ display: "none" }} className="text-blue-500 ml-3"> Download Script</a>
                        </S.Divider>
                    </S.Divider>
                </S.Divider>
            </S.Container>
        </>
    );
};
