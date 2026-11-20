import { useNavigate } from "react-router-dom";
import { RouteChannel, SFC } from "../../../types";
import * as S from '../../../styles'

const linkClass = "hover:text-zinc-600 hover:underline transition-colors focus-visible:outline-none focus-visible:text-zinc-700 focus-visible:underline";

export const PageFooter: SFC = () => {
    const navigate = useNavigate();
    return (
        <S.Container className="footer w-full px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400 border-t border-zinc-200">
            <S.Span>Roots & Morphology &copy; {new Date().getFullYear()}</S.Span>
            <S.Container className="flex items-center gap-2">
                <button type="button" className={linkClass} onClick={() => navigate(RouteChannel.PRIVACY_POLICY)}>Privacy</button>
                <S.Span className="text-zinc-300" aria-hidden="true">&middot;</S.Span>
                <button type="button" className={linkClass} onClick={() => navigate(RouteChannel.TERMS_AND_CONDITIONS)}>Terms</button>
                <S.Span className="text-zinc-300" aria-hidden="true">&middot;</S.Span>
                <S.Span>Version 1.0</S.Span>
            </S.Container>
        </S.Container>
    )
}
