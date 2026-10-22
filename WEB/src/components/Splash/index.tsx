import { SFC } from "../../types";
import * as S from '../../styles'

export const Splash : SFC = ({ClassName}) => {
    return (
        <>
        <S.Container className={ClassName}>
            <S.Content className="w-screen h-screen flex justify-center items-center">
                <img src="/image/RLogoIcon.png" className="w-3/6 h-2/6 sm:w-[200px] sm:h-[200px]"/>
            </S.Content>
        </S.Container>
        </>
    )
}