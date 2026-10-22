import { SFC } from "../../../types";
import * as S from '../../../styles'

export const PageFooter: SFC = () => {
    return (
        <>
            <S.Container className="footer w-full h-10 bg-white mt-2 rounded-md text-zinc-800 flex items-center justify-start px-3 text-sm md:text-base">
               <S.Span className="px-2">roots & morphology &copy; 2024</S.Span>
            </S.Container >
        </>
    )
}