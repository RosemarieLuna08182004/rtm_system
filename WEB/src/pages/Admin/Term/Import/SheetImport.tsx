import { ButtonType, ToastType } from "../../../../types";
import * as S from '../../../../styles'
import { CustomButton } from "../../../../components";
import { Button } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import InfoIcon from '@mui/icons-material/Info';
import { useMemo, useState } from "react";
import { displayToast } from "../../../../utils";
import { downloadImportTemplate, MAX_IMPORT_ROWS, MAX_SHEET_FILE_SIZE, readImportFile, SheetRows } from "../../../../utils/importSheet";
import { useAxiosPrivate, useGetAllCategory, useGetAllChapter } from "../../../../hooks";
import { BASE_URL } from "../../../../shared";
import { ImportResult, ResultBox, VisuallyHiddenInput } from "./shared";

type RowStatus = 'add' | 'skip' | 'error';
interface RowResult { Sheet: 'Terms' | 'Sub Terms'; Row: number; Name: string; Status: RowStatus; Message: string }
interface Summary { termsAdded: number; subTermsAdded: number; skipped: number; problems: number }
interface Preview { summary: Summary; results: RowResult[] }

const STATUS_STYLE: Record<RowStatus, { label: string; className: string }> = {
    add: { label: 'Will add', className: 'bg-green-100 text-green-800' },
    skip: { label: 'Skipped', className: 'bg-zinc-100 text-zinc-700' },
    error: { label: 'Problem', className: 'bg-red-100 text-red-800' },
};
const STATUS_ORDER: Record<RowStatus, number> = { error: 0, skip: 1, add: 2 };
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** Import terms and sub terms from an Excel or CSV file, with a preview before anything is saved. */
export const SheetImport = () => {
    const axios = useAxiosPrivate()
    const { records: volumes } = useGetAllChapter();
    const { records: categories } = useGetAllCategory();
    const [file, setFile] = useState<File | null>(null);
    const [rows, setRows] = useState<SheetRows | null>(null);
    const [preview, setPreview] = useState<Preview | null>(null);
    const [loading, setLoading] = useState<'' | 'reading' | 'importing' | 'template'>('');
    const [result, setResult] = useState<ImportResult | null>(null);
    const [showAll, setShowAll] = useState(false);

    const reset = () => { setFile(null); setRows(null); setPreview(null); setShowAll(false); };

    const send = (data: SheetRows, DryRun: boolean) =>
        axios.post(`${BASE_URL}/term/import-rows`, { DryRun, Terms: data.Terms, SubTerms: data.SubTerms });

    const pickFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const picked = event.target.files?.[0] ?? null;
        event.target.value = ''; // so picking the same file again still triggers a change
        if (!picked) return;
        reset();
        setResult(null);
        if (picked.size > MAX_SHEET_FILE_SIZE) {
            displayToast("The file is larger than 5 MB. Split it into smaller files.", ToastType.error);
            return;
        }
        setLoading('reading');
        try {
            const data = await readImportFile(picked);
            const count = data.Terms.length + data.SubTerms.length;
            if (!count) throw new Error("The file has column headers but no rows to import.");
            if (count > MAX_IMPORT_ROWS) throw new Error(`The file has ${count} rows; the limit is ${MAX_IMPORT_ROWS}. Split it into smaller files.`);
            const response = await send(data, true);
            setFile(picked);
            setRows(data);
            setPreview(response.data.data);
            setShowAll(!response.data.data.summary.problems && !response.data.data.summary.skipped);
        } catch (error: any) {
            const message = error?.response?.data?.message || error.message || "The file couldn't be read.";
            setResult({ ok: false, message });
        } finally {
            setLoading('');
        }
    };

    const runImport = async () => {
        if (!rows) return;
        setLoading('importing');
        try {
            const response = await send(rows, false);
            const message = response.data?.message || "Import finished.";
            setResult({ ok: true, message });
            displayToast(message, ToastType.success);
            reset();
        } catch (error: any) {
            const message = error?.response?.data?.message || "The import failed and nothing was saved. Please try again.";
            setResult({ ok: false, message });
            displayToast(message, ToastType.error);
        } finally {
            setLoading('');
        }
    };

    const downloadTemplate = async () => {
        setLoading('template');
        try {
            await downloadImportTemplate(
                volumes.map(v => v.Title?.trim()).filter((t): t is string => !!t),
                categories.map(c => c.Category?.trim()).filter((c): c is string => !!c),
            );
        } catch {
            displayToast("The template couldn't be created. Please try again.", ToastType.error);
        } finally {
            setLoading('');
        }
    };

    const shown = useMemo(() => {
        const list = [...(preview?.results ?? [])].sort((a, b) =>
            STATUS_ORDER[a.Status] - STATUS_ORDER[b.Status] || a.Sheet.localeCompare(b.Sheet) || a.Row - b.Row);
        return showAll ? list : list.filter(r => r.Status !== 'add');
    }, [preview, showAll]);

    const toAdd = preview ? preview.summary.termsAdded + preview.summary.subTermsAdded : 0;

    return (
        <S.Divider className="w-full flex flex-col">
            <S.Divider className="bg-blue-100 rounded-lg w-full p-3 flex justify-start items-start mb-3">
                <InfoIcon className="text-blue-700 mt-0.5" />
                <S.Divider className="ml-3 flex flex-col gap-1">
                    <S.Span>Add many terms and sub terms at once from an <b>Excel (.xlsx)</b> or <b>CSV</b> file. Download the template, fill it in, then choose it below.</S.Span>
                    <S.Span>You'll see a preview first; nothing is saved until you press Import. Terms already in that volume are <b>skipped</b>, never duplicated. Up to {MAX_IMPORT_ROWS.toLocaleString()} rows per file.</S.Span>
                </S.Divider>
            </S.Divider>

            <details className="w-full mb-3 rounded-lg border border-zinc-200 px-3 py-2">
                <summary className="cursor-pointer text-sm font-medium text-zinc-700">Which columns does the file need?</summary>
                <S.Divider className="mt-2 flex flex-col gap-1 text-sm text-zinc-700">
                    <S.Span><b>Terms</b> sheet: Volume, Term, Focus (optional)</S.Span>
                    <S.Span><b>Sub Terms</b> sheet: Volume, Term, Category, Title (optional), Description</S.Span>
                    <S.Span className="text-xs italic text-zinc-500">Volumes and categories are matched by name (capital letters don't matter). A sub term's term can already exist or be on the Terms sheet of the same file. A CSV file holds one of the two sheets, recognised by its first-row column names.</S.Span>
                </S.Divider>
            </details>

            <S.Divider className="flex flex-col md:flex-row items-center w-full gap-2 mb-3">
                <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={downloadTemplate} disabled={!!loading} className="w-full md:w-[240px] h-10 rounded-md">
                    {loading === 'template' ? 'Preparing…' : 'Download template'}
                </Button>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} disabled={!!loading} className="w-full md:w-[200px] flex items-center justify-center h-10 rounded-md shadow-none" sx={{ border: 'none', background: S.colors.primary, '&:hover': { background: S.colors.secondary } }}>
                    {loading === 'reading' ? 'Checking…' : 'Choose file'}
                    <VisuallyHiddenInput type="file" accept=".xlsx,.csv" onChange={pickFile} />
                </Button>
                {file && <S.Span className="md:ml-3 bg-yellow-100 p-2 rounded-lg">{file.name}</S.Span>}
            </S.Divider>

            {preview && (
                <S.Divider className="w-full flex flex-col gap-3 mb-3">
                    <S.Divider className="flex flex-wrap items-center gap-2 text-sm">
                        <S.Span className="rounded-full bg-green-100 text-green-800 px-3 py-1">{plural(preview.summary.termsAdded, 'new term')}</S.Span>
                        <S.Span className="rounded-full bg-green-100 text-green-800 px-3 py-1">{plural(preview.summary.subTermsAdded, 'new sub term')}</S.Span>
                        <S.Span className="rounded-full bg-zinc-100 text-zinc-700 px-3 py-1">{preview.summary.skipped} skipped</S.Span>
                        <S.Span className={`rounded-full px-3 py-1 ${preview.summary.problems ? 'bg-red-100 text-red-800' : 'bg-zinc-100 text-zinc-700'}`}>{plural(preview.summary.problems, 'problem')}</S.Span>
                        <label className="ml-auto flex items-center gap-2 text-zinc-600 cursor-pointer select-none">
                            <input type="checkbox" checked={showAll} onChange={e => setShowAll(e.target.checked)} /> Show rows that will be added
                        </label>
                    </S.Divider>

                    {shown.length > 0 ? (
                        <S.Divider className="w-full max-h-[340px] overflow-auto rounded-lg border border-zinc-200">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-zinc-50 text-left text-zinc-600">
                                    <tr>
                                        <th className="px-3 py-2 font-medium">Sheet</th>
                                        <th className="px-3 py-2 font-medium">Row</th>
                                        <th className="px-3 py-2 font-medium">Item</th>
                                        <th className="px-3 py-2 font-medium">Status</th>
                                        <th className="px-3 py-2 font-medium">Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shown.map(r => (
                                        <tr key={`${r.Sheet}-${r.Row}`} className="border-t border-zinc-100 align-top">
                                            <td className="px-3 py-2 whitespace-nowrap">{r.Sheet}</td>
                                            <td className="px-3 py-2">{r.Row}</td>
                                            <td className="px-3 py-2">{r.Name}</td>
                                            <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-xs whitespace-nowrap ${STATUS_STYLE[r.Status].className}`}>{STATUS_STYLE[r.Status].label}</span></td>
                                            <td className="px-3 py-2 text-zinc-600">{r.Message}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </S.Divider>
                    ) : (
                        <S.Span className="text-sm italic text-zinc-500">No problems or skipped rows. Tick "Show rows that will be added" to see them.</S.Span>
                    )}

                    <S.Divider className="flex flex-col md:flex-row md:items-center gap-3">
                        <CustomButton icon={<PlaylistAddCheckIcon className="text-white" />} ClassName="relative w-full" morph={false}
                            text={loading === 'importing' ? 'Importing…' : toAdd ? `Import ${plural(toAdd, 'row')}` : 'Nothing to import'}
                            onClick={runImport} type={ButtonType.button} disabled={!!loading || !toAdd} />
                        <Button variant="text" onClick={reset} disabled={!!loading}>Cancel</Button>
                        {preview.summary.problems > 0 && toAdd > 0 && (
                            <S.Span className="text-sm italic text-zinc-500">Rows with problems will be left out. Fix them in the file and choose it again to include them.</S.Span>
                        )}
                    </S.Divider>
                </S.Divider>
            )}

            {result && <ResultBox Result={result} />}
        </S.Divider>
    )
}
