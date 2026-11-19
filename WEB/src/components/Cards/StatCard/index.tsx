import { twMerge } from "tailwind-merge";
import { SFC } from "../../../types";
import * as S from '../../../styles'
import { Icon } from "../../Icon";

export type StatTone = 'blue' | 'violet' | 'teal' | 'orange' | 'indigo';

// Gradient icon tiles, as in the dashboard mockup.
const TONES: Record<StatTone, string> = {
    blue:   'from-blue-500 to-blue-600',
    violet: 'from-violet-400 to-violet-500',
    teal:   'from-teal-400 to-emerald-500',
    orange: 'from-amber-400 to-orange-500',
    indigo: 'from-indigo-400 to-violet-500',
};

interface StatCardProps {
    Icons: string;
    Value: string;
    Title: string;
    Tone?: StatTone;
    OnClick?: () => void;
}

/** Compact KPI card: icon tile on the left, value and label grouped beside it. */
export const StatCard: SFC<StatCardProps> = ({ ClassName, Icons, Value, Title, Tone = 'blue', OnClick }) => {
    return (
        <S.Container
            role="button"
            tabIndex={0}
            onClick={OnClick}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); OnClick?.(); } }}
            className={twMerge("flex items-center gap-3 min-w-0 rounded-lg bg-white px-3 py-3 cursor-pointer transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600", ClassName)}
        >
            <S.Divider className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${TONES[Tone]} text-white shadow-sm`}>
                <Icon icon={Icons} size={28} className="text-white" />
            </S.Divider>
            <S.Divider className="flex flex-col min-w-0 leading-tight">
                <S.Span className="text-2xl font-bold text-slate-800 truncate">{Value}</S.Span>
                <S.Span className="text-sm text-slate-500 truncate">{Title}</S.Span>
            </S.Divider>
        </S.Container>
    );
};