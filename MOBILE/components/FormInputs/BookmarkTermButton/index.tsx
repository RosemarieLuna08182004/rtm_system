import { SFC, TermButtonProps, TermStatus } from "@/types";
import React, { useMemo, useCallback, useState, memo } from "react";
import { renderStatus } from "@/utils";
import * as S from '@/styles';
import { BookmarkIcon } from '@/constants';
import { useAuth } from "@/hooks";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { Alert, ActivityIndicator, GestureResponderEvent } from "react-native";
import { ErrorTitle } from "@/shared";
import { useBookmarkContext } from "@/context";
import { bookmarkApi } from "@/services/api";
import { errorMessageFrom } from "@/utils/errors";

const BookmarkTermButtonComponent: SFC<TermButtonProps> = ({ 
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
  const [isUnbookmarking, setIsUnbookmarking] = useState(false);
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const UserId = useMemo(() => auth?.user?.Id ?? 0, [auth]);
  const { updateBookmarkStatus, incrementBookmarkVersion } = useBookmarkContext();
  
  const displayText = useMemo(() => {
    return String(Text ?? '').trim();
  }, [Text]);

  const handleUnbookmark = useCallback(async (event: GestureResponderEvent) => {
    event.stopPropagation();
    
    if (isUnbookmarking || !OnUnbookmark) return;
    
    setIsUnbookmarking(true);
    
    try {
      // Process API call first, then update UI on success
      if (data?.UserTermsId && data.UserTermsId !== 0) {
        await bookmarkApi.setStatus(data.UserTermsId, false);
        
        // Update global bookmark context to sync with other screens
        if (data?.TermId && UserId) {
          updateBookmarkStatus(data.TermId, UserId, false);
          incrementBookmarkVersion('remove');
        }
        
        // Only remove from UI after successful API call
        OnUnbookmark();
      }
    } catch (error: any) {
      const errorMessage = errorMessageFrom(error);
      Alert.alert(ErrorTitle.m0001, errorMessage);
    } finally {
      setIsUnbookmarking(false);
    }
  }, [isUnbookmarking, OnUnbookmark, data?.UserTermsId, data?.TermId, UserId, axios, updateBookmarkStatus, incrementBookmarkVersion]);
  
  return (
    <S.TouchableOpacity onPress={OnPress} disabled={Disabled || isUnbookmarking} activeOpacity={0.8} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
      <S.View className={`${ClassName} w-full rounded-xl mb-2 ${status.BgColor} overflow-hidden`}>
        <S.View className="flex flex-row min-h-12 py-1 justify-start items-center">
          <S.View className="flex-1 h-full flex items-start justify-center ml-5">
            <S.Text className={`${status.TextColor} text-medium font-psemibold`} numberOfLines={1} style={{ fontFamily: 'Poppins_600SemiBold' }}>
              {displayText}
            </S.Text>
          </S.View>
          
          {/* Custom bookmark button for bookmark screen */}
          <S.TouchableOpacity
            className="w-3/12 flex justify-center items-end h-12 pr-3"
            onPress={handleUnbookmark}
            disabled={Disabled || isUnbookmarking}
            accessibilityRole="button"
            accessibilityLabel={`Remove bookmark: ${displayText}`}
            accessibilityState={{ busy: isUnbookmarking }}
          >
            <S.View className="flex flex-row justify-end items-center">
              {isUnbookmarking ? (
                <ActivityIndicator size="small" color={status.IconColor} />
              ) : (
                <S.Image 
                  source={BookmarkIcon} 
                  className="w-[25px] h-[25px]"
                  style={{ tintColor: status.IconColor }}
                />
              )}
            </S.View>
          </S.TouchableOpacity>
        </S.View>
      </S.View>
    </S.TouchableOpacity>
  );
};

export const BookmarkTermButton = memo(BookmarkTermButtonComponent);
