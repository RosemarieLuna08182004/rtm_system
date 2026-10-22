import { DashboardCardProps, SFC } from "../../../types";
import * as S from '../../../styles'
import { twMerge } from "tailwind-merge";
import { Icon } from "../../Icon";

export const DashboardCard: SFC<DashboardCardProps> = ({ClassName, Icons, Text ='NA', Title ='NA', OnClick}) => {
    return (
        <>
        <S.Container className={twMerge(" w-full rounded-lg bg-white p-2 cursor-pointer ", ClassName)} onClick={OnClick}>
            <S.Content className="top w-full flex flex-row">
                <div className="icon w-4/12 overflow text-primary">
                    <Icon icon={Icons} size={60} className="text-primary "/>
                </div>
                <S.Span className="text text-2xl text-primary font-semibold flex justify-end w-8/12">{Text}</S.Span>
            </S.Content>
            <S.Content className="bot flex justify-end">
                <S.Span className="title text-slate-800 text-sm">{Title}</S.Span>
            </S.Content>
        </S.Container>
        </>
    )
}