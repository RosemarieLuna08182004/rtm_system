import { ButtonType, ToastType } from "../../../../types";
import * as S from '../../../../styles'
import { CustomButton } from "../../../../components";
import { Button } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from "react";
import { displayToast } from "../../../../utils";
import { useAxiosPrivate } from "../../../../hooks";
import { BASE_URL } from "../../../../shared";
import { ImportResult, ResultBox, VisuallyHiddenInput } from "./shared";

/**
 * The server accepts request bodies up to 2 MB, but an SQL script is checked and
 * run as one statement, so it is kept small.
 */
const MAX_FILE_SIZE = 90 * 1024;

const EXAMPLE = `INSERT INTO \`term\` (\`ChapterId\`, \`Term\`, \`Definition\`, \`CreatedBy\`, \`DateCreated\`) VALUES
  (1, 'Cranium', '', 16, NOW()),
  (1, 'Mandible', '', 16, NOW());`;

/** Import from a .sql file holding a single INSERT INTO term / termline. */
export const SqlImport = () => {
    const axios = useAxiosPrivate()
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const [result, setResult] = useState<ImportResult | null>(null)

    const pickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const picked = event.target.files?.[0] ?? null;
        event.target.value = ''; // so picking the same file again still triggers a change
        setResult(null);
        if (!picked) return;
        if (!picked.name.toLowerCase().endsWith('.sql')) {
            displayToast("Please choose a .sql file.", ToastType.error);
            return;
        }
        if (picked.size > MAX_FILE_SIZE) {
            displayToast("The file is larger than 90 KB. Split it into smaller files and import them one at a time.", ToastType.error);
            return;
        }
        setFile(picked);
    };

    // The server checks the script's contents and explains anything it refuses.
    const processScript = async () => {
        if (!file) return;
        setLoading(true);
        setResult(null);
        try {
            const content = await file.text();
            if (!content.trim()) {
                setResult({ ok: false, message: "The file is empty." });
                return;
            }
            const response = await axios.post(`${BASE_URL}/term/import-data`, { Query: content });
            const message = response.data?.message || "Import finished.";
            setResult({ ok: true, message });
            displayToast(message, ToastType.success);
            setFile(null);
        } catch (error: any) {
            const message = error?.response?.data?.message || "The import failed. Please try again.";
            setResult({ ok: false, message });
            displayToast(message, ToastType.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <S.Divider className="w-full flex flex-col">
            <S.Divider className="bg-blue-100 rounded-lg w-full p-3 flex justify-start items-start mb-2">
                <InfoIcon className="text-blue-700 mt-0.5" />
                <S.Divider className="ml-3 flex flex-col gap-1">
                    <S.Span>For records exported from a database. An import can only <b>add</b> records; it can't change or delete existing ones.</S.Span>
                    <S.Span>The file must hold a single <code>INSERT INTO term</code> or <code>INSERT INTO termline</code> statement with plain values, and be under 90 KB (roughly 500 records). Anything else is refused with the reason.</S.Span>
                </S.Divider>
            </S.Divider>

            <details className="w-full mb-3 rounded-lg border border-zinc-200 px-3 py-2">
                <summary className="cursor-pointer text-sm font-medium text-zinc-700">Show an example file</summary>
                <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-50 p-3 text-xs text-zinc-800">{EXAMPLE}</pre>
                <S.Span className="block mt-1 text-xs italic text-zinc-500">ChapterId is the volume's ID; CreatedBy is your user ID. Definition can stay empty; add the meaning as a "Brief Definition" sub term. Text with an apostrophe is written with two: 'It''s'.</S.Span>
            </details>

            <S.Divider className="flex flex-col justify-start gap-4 items-start w-full">
                <S.Divider className="flex flex-col md:flex-row items-center w-full gap-2">
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} className=" w-full md:w-[200px]  flex items-center justify-center h-10 rounded-md shadow-none" sx={{ border: 'none', background: S.colors.primary,'&:hover': { background: S.colors.secondary }}}>
                        Choose file
                        <VisuallyHiddenInput type="file" accept=".sql" onChange={pickFile} />
                    </Button>
                    {file
                        ? <S.Span className="md:ml-3 bg-yellow-100 p-2 rounded-lg">{file.name} · {(file.size / 1024).toFixed(1)} KB</S.Span>
                        : <S.Span className="md:ml-3 text-sm italic text-zinc-500">No file chosen</S.Span>}
                </S.Divider>
                <S.Divider className="flex flex-row items-center w-full justify-end md:justify-start">
                    <CustomButton icon={<QueryBuilderIcon className="text-white"/>} ClassName="relative w-full " morph={false} text={loading ? "Importing…" : "Import"} onClick={processScript} type={ButtonType.button} disabled={loading || !file}/>
                </S.Divider>
                {result && <ResultBox Result={result} />}
            </S.Divider>
        </S.Divider>
    )
}
