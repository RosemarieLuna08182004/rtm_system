import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined';
import { AttentionIssue, AttentionSeverity, toAttentionFilter } from "../../../utils";
import { SFC } from "../../../types";
import * as S from '../../../styles'
import { Skeleton } from "../../Skeleton";

interface NeedsAttentionCardProps {
    Issues: AttentionIssue[];
    Loading?: boolean;
}

const SEVERITY_STYLES: Record<AttentionSeverity, { label: string; Icon: typeof ErrorOutlineIcon; icon: string; badge: string }> = {
    high:   { label: 'High',   Icon: ErrorOutlineIcon,          icon: 'text-red-500',   badge: 'bg-red-50 text-red-600' },
    medium: { label: 'Medium', Icon: ReportProblemOutlinedIcon, icon: 'text-amber-500', badge: 'bg-amber-50 text-amber-600' },
    low:    { label: 'Low',    Icon: InfoOutlinedIcon,          icon: 'text-sky-500',   badge: 'bg-sky-50 text-sky-600' },
};

export const NeedsAttentionCard: SFC<NeedsAttentionCardProps> = ({ ClassName, Issues, Loading = false }) => {
    const navigate = useNavigate();
    const [openKey, setOpenKey] = useState<string | null>(null);
    const total = Issues.reduce((sum, issue) => sum + issue.count, 0);

    return (
        <S.Container className={twMerge("w-full min-w-0 h-full flex flex-col bg-white rounded-lg border border-slate-200/70 shadow-sm p-4", ClassName)}>
            <S.Divider className="flex items-center justify-between mb-3">
                <S.Divider className="flex items-center gap-2">
                    <NotificationImportantOutlinedIcon className="text-primary" fontSize="small" />
                    <S.Span className="font-semibold text-zinc-700">Needs Attention</S.Span>
                    {!Loading && total > 0 && (
                        <S.Span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">{total.toLocaleString()}</S.Span>
                    )}
                </S.Divider>
                <S.Span className="hidden xl:inline text-xs text-slate-400">Items that are incomplete or need follow-up</S.Span>
            </S.Divider>

            {Loading ? (
                <Skeleton ClassName="py-8" />
            ) : Issues.length === 0 ? (
                <S.Divider className="flex-1 flex flex-col items-center justify-center gap-2 text-green-500">
                    <CheckCircleOutlineIcon fontSize="large" />
                    <S.Span className="text-sm text-slate-500">All caught up. Nothing needs attention.</S.Span>
                </S.Divider>
            ) : (
                <S.Divider className="flex-1 flex flex-col divide-y divide-slate-100">
                    {Issues.map((issue) => {
                        const { Icon, icon, badge, label } = SEVERITY_STYLES[issue.severity];
                        const isOpen = openKey === issue.key;
                        const hiddenCount = issue.count - issue.items.length;
                        return (
                            <S.Divider key={issue.key}>
                                <button
                                    type="button"
                                    aria-expanded={isOpen}
                                    onClick={() => setOpenKey(isOpen ? null : issue.key)}
                                    className="w-full flex items-center gap-3 py-2 text-left bg-transparent border-0 cursor-pointer hover:bg-slate-50 rounded-md px-1"
                                >
                                    <Icon className={icon} fontSize="small" />
                                    <S.Divider className="flex flex-col flex-1 min-w-0">
                                        <S.Span className="text-sm font-medium text-zinc-700 truncate">{issue.title}</S.Span>
                                        <S.Span className="text-xs text-slate-400 truncate">{issue.description}</S.Span>
                                    </S.Divider>
                                    <S.Span className={`hidden sm:inline text-[11px] font-medium px-2 py-0.5 rounded-full ${badge}`}>{label}</S.Span>
                                    <S.Span className="text-sm font-bold text-primary min-w-[2.5rem] text-right">{issue.count.toLocaleString()}</S.Span>
                                    <ExpandMoreIcon fontSize="small" className="text-slate-400" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
                                </button>

                                {isOpen && (
                                    <S.Divider className="pl-9 pr-1 pb-3 flex flex-col gap-1">
                                        {issue.items.map((item) => (
                                            <button
                                                key={`${issue.key}-${item.id}`}
                                                type="button"
                                                onClick={() => navigate(item.route)}
                                                className="flex items-center justify-between gap-2 text-left bg-slate-50 hover:bg-blue-50 rounded-md px-3 py-2 border-0 cursor-pointer"
                                            >
                                                <S.Divider className="flex flex-col min-w-0">
                                                    <S.Span className="text-sm text-zinc-700 truncate">{item.label}</S.Span>
                                                    {item.sublabel && <S.Span className="text-xs text-slate-400 truncate">{item.sublabel}</S.Span>}
                                                </S.Divider>
                                                <ChevronRightIcon fontSize="small" className="text-slate-400 shrink-0" />
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => navigate(issue.viewAllRoute, { state: { attention: toAttentionFilter(issue) } })}
                                            className="self-start mt-1 text-xs font-medium text-primary bg-transparent border-0 cursor-pointer hover:underline"
                                        >
                                            {hiddenCount > 0 ? `View all ${issue.count.toLocaleString()} →` : 'Open in list →'}
                                        </button>
                                    </S.Divider>
                                )}
                            </S.Divider>
                        );
                    })}
                </S.Divider>
            )}
        </S.Container>
    );
};