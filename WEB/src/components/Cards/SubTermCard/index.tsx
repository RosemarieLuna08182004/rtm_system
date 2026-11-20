import { RouteChannel, SFC, SubTermCardProps } from "../../../types";
import { ZoomableImage } from "../../ZoomableImage";
import * as S from '../../../styles';;
import { useRemoveTermLine } from "../../../hooks";
import { twMerge } from "tailwind-merge";
import { SubTermOption } from "../../DropDown";
import { useNavigate } from "react-router-dom";
import { sanitizeHtml } from "../../../utils/sanitizeHtml";

export const SubTermCard: SFC<SubTermCardProps> = ({ ClassName, Id, Term, Description, refetch, IsBorderLeft = false, Illustration = null, ShowOptions = true }) => {
    const { remove } = useRemoveTermLine();
    const navigate = useNavigate()

    const handleRemove = async () => {
        await remove(Id);
        refetch();
    };

    return (
        <>
            <S.Content key={Id} className={twMerge("mb-2 flex items-center ",ClassName)}>
                <S.Container className={`relative w-full ${IsBorderLeft?'':Illustration?'':'rounded-lg bg-blue-50 p-3'}`}>
                    {ShowOptions && <SubTermOption ClassName="absolute right-0 top-0" EditOnClick={()=> navigate(`${RouteChannel.TERM_LINE_DETAILS.slice(0,RouteChannel.TERM_LINE_DETAILS.length-3)}${Id}`) } DeleteOnClick={handleRemove}/>}
                    {Illustration && <ZoomableImage Src={Illustration} Alt={Term ? `Illustration for ${Term}` : 'Sub term illustration'} ClassName="w-full h-auto rounded-lg" />}
                    {Term && <S.Divider className="w-full mb-2 flex justify-between items-center">
                        <S.Span className="text-sm text-slate-600 font-semibold">{Term}</S.Span>
                    </S.Divider>}
                    {Description && <S.Divider className={`w-full ${IsBorderLeft?'border-left-primary p-5':'rounded-lg bg-blue-50 p-3'}`}>
                        <S.Span className={`text-sm text-slate-700`} dangerouslySetInnerHTML={{ __html: sanitizeHtml(Description) }} />
                    </S.Divider>}
                </S.Container>
            </S.Content>
        </>
    );
};
