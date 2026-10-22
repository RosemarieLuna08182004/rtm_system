import { useNavigate } from "react-router-dom";
import { Roles, SFC } from "../../types";
import { useAuth } from "../../hooks";
import { renderPath } from "../../utils";
import * as S from '../../styles'

export const UnauthorizedPage : SFC = () => {
    const navigate = useNavigate()
    const { auth } = useAuth()
    return (
        <>
        <S.Container className="w-full h-full justify-center items-center flex">
            <S.Main className="grid place-items-center px-6 py-24 sm:py-56 lg:px-8">
                <S.Content className="text-center">
                    <S.P className="text-base font-semibold text-zinc-950">403</S.P>
                    <S.H1 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-5xl">
                        Access Denied
                    </S.H1>
                    <S.P className="mt-6 text-base leading-7 text-gray-600">
                        Sorry, you don't have permission to access this page
                    </S.P>
                    <S.Content className="mt-10 flex items-center justify-center gap-x-6">
                        <button  onClick={() => navigate(`/${renderPath(auth?.roles??Roles.default)}`)} className=''>Home</button>
                    </S.Content>
                </S.Content>
            </S.Main>
        </S.Container>
        </>
    )
}