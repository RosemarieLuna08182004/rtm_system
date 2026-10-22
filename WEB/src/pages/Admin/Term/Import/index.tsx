import { ButtonType, RouteChannel, SFC, ToastType } from "../../../../types";
import * as S from '../../../../styles'
import { CustomButton, PageBreadCrumbs } from "../../../../components";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WarningIcon from '@mui/icons-material/Warning';
import { Button, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { useState } from "react";
import { displayToast } from "../../../../utils";
import { useAxiosPrivate } from "../../../../hooks";
import { BASE_URL } from "../../../../shared";
import InfoIcon from '@mui/icons-material/Info';
export const AdminTermImportPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const axios = useAxiosPrivate()
    const [filename, setFilename] = useState<string>('');
    const [uploadedfile, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const MAX_FILE_SIZE = 100 * 1024;

    const links = [
        { Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) },
        { Text: 'Settings', OnClick: () => navigate(RouteChannel.SETTINGS) },
    ]

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

    const processScript = async () => {
        if (!uploadedfile || !(uploadedfile instanceof Blob)) {
            displayToast("Please select a valid .sql file.", ToastType.error);
            return;
        }

        if (uploadedfile.size > MAX_FILE_SIZE) {
            displayToast("File size exceeds 100KB. Please upload a smaller file.", ToastType.error);
            return;
        }

        if (uploadedfile.type.trim().includes("text")) {
            displayToast("Invalid file type. Only .sql files are accepted.", ToastType.error);
            return;
        }
    
        const reader = new FileReader();
        setLoading(true);
    
        reader.onload = async (event) => {
            const content = event.target?.result as string;
    
            if (!content) {
                setLoading(false);
                displayToast("File content is empty", ToastType.error);
                return;
            }
    
            const lowerCaseContent = content.toLowerCase();
            if (lowerCaseContent.includes("delete from") || lowerCaseContent.includes("delete")) {
                setLoading(false);
                displayToast(
                    "Script contains potentially harmful operations like DELETE or UPDATE. Please review the script before proceeding.",
                    ToastType.error
                );
                return;
            }
    
            try {
                const response = await axios.post(`${BASE_URL}/term/import-data`, { Query: content });
                setLoading(false);
    
                if (response.data.data) {
                    displayToast("Data imported successfully", ToastType.success);
                } else {
                    displayToast("Import completed, but no data was affected.", ToastType.error);
                }
            } catch (error: any) {
                setLoading(false);
                console.log(error?.response)
                displayToast(error?.response?.data?.message || "Error during import", ToastType.error);
            }
        };
    
        reader.onerror = () => {
            setLoading(false);
            displayToast("Failed to read the file", ToastType.error);
        };
    
        reader.readAsText(uploadedfile);
    };

    return (
        <>
            <S.Container className={ClassName}>
                <S.PageTopBar className="breadcrumbs w-full  bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                    <S.Actions className="flex justify-between w-full items-center">
                        <PageBreadCrumbs Links={links} Active="Import"/>
                        <CustomButton  icon={<ArrowBackIcon className="md:text-white text-primary" />} onClick={()=>navigate(RouteChannel.SETTINGS)} text='Back' type={ButtonType.button} />
                    </S.Actions >
                </S.PageTopBar>
                <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 flex items-center px-3 py-2">
                    <S.Divider className="bg-red-100 rounded-lg w-full p-3 flex justify-start items-center mb-2">
                        <WarningIcon className="text-red-500" /><S.Span className="ml-3">Importing sql script could potentially affect the integrity of the current database. Please carefully review the script before proceeding with the import.</S.Span>
                    </S.Divider>
                    <S.Divider className="bg-blue-100 rounded-lg w-full p-3 flex justify-start items-center mb-2">
                        <InfoIcon className="text-blue-700" /><S.Span className="ml-3"> For optimal performance and to prevent potential issues during processing, it is recommended to limit each import to a maximum of 500 records.<br/> This helps ensure the system handles the data efficiently and minimizes the risk of errors or timeouts.d </S.Span>
                    </S.Divider>
                    <S.Divider className="w-full">
                        <S.Divider className="flex flex-col justify-start gap-4 items-start w-full">
                            <S.Divider className="flex flex-col md:flex-row items-center w-full gap-2">
                                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} className=" w-full md:w-[200px]  flex items-center justify-center h-10 rounded-md shadow-none" sx={{minWidth: '',  border: 'none', background: S.colors.primary,'&:hover': { background: S.colors.secondary }}}>
                                    Upload Script
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept=".sql"
                                        multiple
                                        onChange={(event) => { const files = event.target.files; if (files?.length) {setFilename(files[0]?.name);setFile(files[0]);console.log(files[0]) } else displayToast("No File selected", ToastType.error) }} 
                                    />
                                </Button>
                                {filename && (<S.Span className="ml-5 bg-yellow-100 p-2 rounded-lg"> {filename}</S.Span>)}
                            </S.Divider>
                            <S.Divider className="flex flex-row items-center w-full justify-end md:justify-start">
                                <CustomButton icon={<QueryBuilderIcon className="text-white"/>} ClassName="relative w-full " morph={false} text="Process Script" onClick={processScript} type={ButtonType.button} disabled={loading}/>
                            </S.Divider>
                        </S.Divider>
                    </S.Divider>
                </S.Content> 
            </S.Container> 
        </>
    )
}