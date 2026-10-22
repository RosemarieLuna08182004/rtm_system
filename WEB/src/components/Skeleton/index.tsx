import { SFC } from "../../types"
import  * as S from  '../../styles'
import CircularProgress from '@mui/material/CircularProgress';
import { twMerge } from "tailwind-merge";

export const Skeleton:SFC = ({ClassName}) => {
    return  (
        <>
            <S.Container className={twMerge("w-full h-full  ", ClassName)}>
                <S.Content className="flex  items-center justify-center">
                    <CircularProgress/>
                </S.Content>
            </S.Container>
        </>
    )
}