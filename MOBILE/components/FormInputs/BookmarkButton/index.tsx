import React, { memo, useCallback, useMemo, useState, useEffect } from "react";
import { BookmarkButtonProps, SFC, TermStatus } from "@/types";
import * as S from "../../../styles";
import { useAuth, useToggle } from "@/hooks";
import { API, BookmarkIcon, BookmarkOutlineIcon } from "@/constants";
import { renderStatus } from "@/utils";
import { Alert, GestureResponderEvent, ActivityIndicator } from "react-native";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { ErrorTitle, Error } from "@/shared";
import { useBookmarkContext } from "@/context";

export const BookmarkButton: SFC<BookmarkButtonProps> = memo(
  ({ 
    ClassName, 
    Status = TermStatus.lock, 
    Disabled = false,
    UserTermsId = 0, 
    TermId = 0, 
    OnPress, 
    OnUnbookmark,
    IsChapter = false,
    NoLoading = false
  }) => {
    const status = renderStatus(Status, IsChapter);
    const axios = useAxiosPrivate();
    const { auth } = useAuth();
    const UserId = useMemo(()=>auth?.user?.Id ?? 0,[auth]);
    const { updateBookmarkStatus, incrementBookmarkVersion } = useBookmarkContext();
    
    // Initialize bookmark state directly from Status prop (already from API)
    const initialBookmarkState = useMemo(() => {
      return Status === TermStatus.bookmark;
    }, [Status]);
    
    const [isBookmark, toggleBookmark] = useToggle(initialBookmarkState);
    const [isLoading, setIsLoading] = useState(false);
    const BookmarkIcons = isBookmark ? BookmarkIcon : BookmarkOutlineIcon;

    // Update bookmark state when Status prop changes (from API or refresh)
    useEffect(() => {
      const newState = Status === TermStatus.bookmark;
      if (newState !== isBookmark) {
        toggleBookmark();
      }
    }, [Status]);

    const handleBookmarkToggle = useCallback(
      async (event: GestureResponderEvent) => {
        event.stopPropagation?.();
        
        
        if (isLoading && !NoLoading) return; // Prevent multiple simultaneous requests only if loading is shown
        
        if (!NoLoading) {
          setIsLoading(true);
        }

        // If we have a custom OnUnbookmark handler and we're unbookmarking, use it
        if (OnUnbookmark && isBookmark) {
          // Immediately remove from UI - no loading, no waiting
          OnUnbookmark();
          
          // Process API call silently in background without loading states
          (async () => {
            try {
              if (UserTermsId && UserTermsId !== 0) {
                await axios.delete(`${API}/user/term/remove/${UserTermsId}`);
              }
              // Update global context after successful API call
              if (TermId && UserId) {
                updateBookmarkStatus(TermId, UserId, false);
                incrementBookmarkVersion('remove');
              }
            } catch (error: any) {
              // On error, show alert but don't revert UI since item is already removed
              const errorMessage = error.response?.data?.message || Error.m0001;
              Alert.alert(ErrorTitle.m0001, errorMessage);
            }
          })();
          
          if (!NoLoading) {
            setIsLoading(false);
          }
          return;
        }
        
        toggleBookmark(); // Optimistic update for regular bookmark/unbookmark
        
        // Update global context immediately for optimistic update
        if (TermId && UserId) {
          updateBookmarkStatus(TermId, UserId, !isBookmark);
          incrementBookmarkVersion(!isBookmark ? 'add' : 'remove'); // Notify all components of the change
        }

        try {
          if (!UserTermsId && TermId) {
            await axios.post(`${API}/user/term/bookmark/${TermId}/${UserId}`);
          } else if (UserTermsId && UserTermsId !== 0) {
            const statusPayload = isBookmark ? { Status: 0 } : { Status: 1 };
            await axios.patch(`${API}/user/term/unbookmark/${UserTermsId}`, statusPayload);
          }
          // Success - no need to call OnPress (refetch) anymore
        } catch (error: any) {
          // Handle "Record already exists" error - treat as success
          if (error?.response?.data?.message === "Record already exists") {
            // Don't revert the optimistic update, keep the bookmark state
            return;
          }
          
          toggleBookmark(); // Revert the optimistic update on error
          // Revert global context on error
          if (TermId && UserId) {
            updateBookmarkStatus(TermId, UserId, isBookmark);
          }
          Alert.alert(ErrorTitle.m0001, Error.m0001);
        } finally {
          if (!NoLoading) {
            setIsLoading(false);
          }
        }
      },
      [UserId, UserTermsId, TermId, isBookmark, axios, toggleBookmark, isLoading, OnUnbookmark, NoLoading, updateBookmarkStatus]
    );

    // Conditional rendering for bookmarked/unlocked state
    if (Status === TermStatus.bookmark || Status === TermStatus.unbookmark) {
      return (
        <S.TouchableOpacity
          className={`w-3/12 flex justify-center items-end h-12 pr-3 ${ClassName}`}
          onPress={handleBookmarkToggle}
          disabled={Disabled || isLoading}
        >
          <S.View className="flex flex-row justify-end items-center">
            {isLoading && !NoLoading ? (
              <ActivityIndicator size="small" color={status.IconColor} />
            ) : (
              <S.Image
                className="w-[25px] h-[25px]"
                source={BookmarkIcons}
                tintColor={status.IconColor}
              />
            )}
          </S.View>
        </S.TouchableOpacity>
      );
    }
    
    return (
      <S.View
        className={`flex flex-row justify-end items-center h-12 w-3/12 pr-3 ${ClassName}`}
      >
        <S.Image
          className="w-[25px] h-[25px]"
          source={status.Icon}
          tintColor={status.IconColor}
        />
      </S.View>
    );
  }
);

