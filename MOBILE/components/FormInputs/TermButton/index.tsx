import { SFC, TermButtonProps, TermStatus } from "@/types";
import React, { useMemo, memo } from "react";
import { renderStatus } from "@/utils";
import { getHighlightedText } from "@/utils/textHighlight";
import * as S from '@/styles';
import { BookmarkButton } from "../BookmarkButton";

const TermButtonComponent: SFC<TermButtonProps> = ({ 
  ClassName, 
  Text = 'NA', 
  IsChapter = false, 
  Status = TermStatus.lock, 
  OnPress, 
  Disabled = false, 
  data, 
  OnRefresh,
  OnUnbookmark,
  HighlightQuery = ''
}) => {
  const status = renderStatus(Status, IsChapter);
  
  const displayText = useMemo(() => {
    return String(Text ?? '').trim();
  }, [Text]);

  const highlightedText = useMemo(() => {
    return getHighlightedText(displayText, HighlightQuery);
  }, [displayText, HighlightQuery]);

  return (
    <S.TouchableOpacity onPress={OnPress} disabled={Disabled} activeOpacity={0.8} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
      <S.View className={`${ClassName} w-full rounded-xl mb-2 ${status.BgColor} overflow-hidden`}>
        <S.View className="flex flex-row min-h-12 py-1 justify-start items-center">
          <S.View className="flex-1 h-full flex items-start justify-center ml-5">
            <S.Text className={`${status.TextColor} text-medium font-psemibold`} numberOfLines={1} style={{ fontFamily: 'Poppins_600SemiBold' }}>
              {highlightedText}
            </S.Text>
          </S.View>
          <BookmarkButton 
            Status={Status} 
            Disabled={Disabled} 
            UserTermsId={data?.UserTermsId ?? 0} 
            TermId={data?.TermId ?? 0} 
            OnPress={undefined} 
            OnUnbookmark={OnUnbookmark}
            IsChapter={IsChapter}
          />
        </S.View>
      </S.View>
    </S.TouchableOpacity>
  );
};

export const TermButton = memo(TermButtonComponent);