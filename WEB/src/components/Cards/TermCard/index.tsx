import { ButtonType, SFC, TermCardProps } from "../../../types";
import * as S from '../../../styles';
import { CircleButton } from "../../FormInputs";
import { useGetAllTermLineByTerm, useToggle } from "../../../hooks";
import AddIcon from '@mui/icons-material/Add';
import { SubTermModal } from "../../../modals";
import { twMerge } from "tailwind-merge";
import { Suspense, useEffect } from "react";
import React from "react";
import { SubTermCard } from "../SubTermCard";
import { Skeleton } from "../../Skeleton";
import { AudioPlayer } from "../../Audio/AudioPlayer";
  
export const TermCard: SFC<TermCardProps> = ({ ClassName, Refetch, TermId, TermTitle, ChapterTitle, VoiceOver, Illustration }) => {
    const [modalOpen, toggleModal] = useToggle(false);
    const { records, refetch, loading } = useGetAllTermLineByTerm(TermId);

    useEffect(() => {
        Refetch();
    }, [Refetch, TermId]);

    const handleModalClose = () => {
        toggleModal();
        Refetch();
        refetch();
    };

    return (
        <>
            <S.Container className={twMerge("bg-white md:w-4/12 w-full flex flex-col rounded-lg justify-start p-3 overflow-auto md:h-fit", ClassName)}>
                <S.Content className="w-full mb-2 flex justify-between">
                    <S.Content className="mb-5 flex flex-col">
                        <S.Span className="text-sm text-slate-800">{ChapterTitle}</S.Span>
                        <S.Span className="txt-md text-primary font-bold">{TermTitle}</S.Span>
                    </S.Content>
                    <S.Content className="flex flex-row gap-2">
                        {VoiceOver && <AudioPlayer URL={VoiceOver??""} />}
                        <CircleButton 
                            OnClick={toggleModal} 
                            IsNotification={false} 
                            Icon={<AddIcon className="text-primary" />} 
                            Type={ButtonType.button} 
                            Title="New Sub Term"
                        />
                    </S.Content>
                </S.Content>

                {/* Illustration section */}
                {Illustration && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                        <S.Image 
                            src={decodeURIComponent(Illustration.startsWith('http') ? Illustration : `/${Illustration}`)} 
                            alt={`Illustration for ${TermTitle}`}
                            className="w-full h-auto max-h-64 object-cover rounded-lg"
                            onError={(e) => {
                                // Try with the encoded URL if the decoded one fails
                                const target = e.target as HTMLImageElement;
                                if (target.src !== Illustration) {
                                    target.src = Illustration;
                                } else {
                                    target.style.display = 'none';
                                }
                            }}
                        />
                    </div>
                )}
                
                {/* Subterm cards section */}
                {records && !loading ? (
                <Suspense fallback={<Skeleton />}>
                    <S.Content className="mb-2">
                    {records.reduce<React.ReactNode[]>((acc, subterm, index, arr) => {
                        const isFirstOfCategory = index === 0 || subterm.Category !== arr[index - 1].Category;
                        const isLast = subterm.Category !== arr[index + 1]?.Category;
                        const fragmentKey = `fragment-${subterm.Id}-${index}`;
                        
                        return acc.concat(
                            <React.Fragment key={fragmentKey}>
                                {isFirstOfCategory && (
                                <div key={`category-${subterm.Category}`} className="w-full mb-2">
                                    <S.Divider className="w-full flex justify-between items-center">
                                        <S.Span className="text-sm uppercase text-primary font-bold">{subterm.Category ?? "NA"}</S.Span>
                                    </S.Divider>
                                </div>
                                )}
                                <SubTermCard
                                    key={subterm.Id}
                                    Id={Number(subterm.Id)}
                                    Category={subterm.Category ?? ""}
                                    Term={subterm.Term ?? ""}
                                    Description={subterm.Description ?? ""}
                                    refetch={() => refetch()}
                                    IsBorderLeft={subterm.IsBorderLeft}
                                    // Illustration={subterm?.Illustration ?? null}
                                    ClassName={isLast ? 'mb-5' : ''}
                                />
                            </React.Fragment>
                        );
                    }, [])}
                    </S.Content>
                </Suspense>
                ) : (
                <Skeleton />
                )}
            </S.Container>
            {modalOpen && (<SubTermModal close={handleModalClose} title="New Sub Term" ClassName="w-11/12" />)}
        </>
    );
};

