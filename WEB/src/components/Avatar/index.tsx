import { twMerge } from "tailwind-merge";
import { GenericFunction, SFC } from "../../types";
import * as S from '../../styles'

interface AvatarProps {
    Image: string
    OnClick: GenericFunction
}

export const Avatar: SFC<AvatarProps> = ({ClassName, Image, OnClick}) => {
    return (
        <>
            <S.Container className={twMerge(" hover:opacity-90 cursor-pointer w-[40px] h-[40px]", ClassName)} onClick={OnClick}>
                <S.Content className="w-full relative ">
                    <img src={Image?Image:'/image/default-image.jpg'} className="rounded-full w-[40px] h-[40px] border-primary"/>
                </S.Content>
            </S.Container>
        </> 
    )
}