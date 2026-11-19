import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { SFC } from "../../types";
import * as S from '../../styles'

interface SectionHeaderProps {
    Title: string;
    /** Short line under the underline saying what the section is for */
    Description?: string;
    /** Pill beside the title, e.g. a record count */
    Badge?: ReactNode;
    /** For aria-labelledby, e.g. a table pointing at its title */
    Id?: string;
}

/** Section title for forms and tables: large bold title, short blue underline, italic description. */
export const SectionHeader: SFC<SectionHeaderProps> = ({ ClassName, Title, Description, Badge, Id }) => {
    if (!Title) return null;
    return (
        <S.Divider className={twMerge("flex flex-col min-w-0", ClassName)}>
            <S.Divider className="flex items-center gap-2 flex-wrap">
                <S.Span id={Id} className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-tight">{Title}</S.Span>
                {Badge !== undefined && Badge !== null && Badge !== '' && (
                    <S.Span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-primary">{Badge}</S.Span>
                )}
            </S.Divider>
            <S.Span className="block w-10 h-1 rounded-full bg-primary mt-1.5" aria-hidden="true" />
            {Description && <S.Span className="text-sm italic text-slate-500 mt-1.5">{Description}</S.Span>}
        </S.Divider>
    );
};
