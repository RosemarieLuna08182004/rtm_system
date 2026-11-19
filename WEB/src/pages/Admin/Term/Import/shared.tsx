import { styled } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import * as S from '../../../../styles'

export type ImportResult = { ok: boolean; message: string };

/** File input hidden inside a MUI button. */
export const VisuallyHiddenInput = styled('input')({
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

/** Outcome of the last import, kept on screen until the next one. */
export const ResultBox = ({ Result }: { Result: ImportResult }) => (
    <S.Divider role="status" className={`w-full rounded-lg p-3 flex items-start gap-3 ${Result.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
        {Result.ok ? <CheckCircleIcon className="text-green-600" /> : <ErrorIcon className="text-red-500" />}
        <S.Span>{Result.message}</S.Span>
    </S.Divider>
);
