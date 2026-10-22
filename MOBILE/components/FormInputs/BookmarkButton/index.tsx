import React, { memo, useCallback, useMemo, useRef, useState, useEffect } from "react";
import { BookmarkButtonProps, SFC, TermStatus } from "@/types";
import * as S from "../../../styles";
import { useAuth } from "@/hooks";
import { BookmarkIcon, BookmarkOutlineIcon } from "@/constants";
import { bookmarkApi } from "@/services/api";
import { renderStatus } from "@/utils";
import { Alert, GestureResponderEvent, ActivityIndicator } from "react-native";
import { ErrorTitle } from "@/shared";
import { useBookmarkContext } from "@/context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { errorMessageFrom } from "@/utils/errors";

export const BookmarkButton: SFC<BookmarkButtonProps> = memo(
  ({
    ClassName,
    Status = TermStatus.lock,
    Disabled = false,
    UserTermsId = 0,
    TermId = 0,
    OnUnbookmark,
    IsChapter = false,
    NoLoading = false,
    Variant = 'default'
  }) => {
    const status = renderStatus(Status, IsChapter);
    const { auth } = useAuth();
    const UserId = useMemo(()=>auth?.user?.Id ?? 0,[auth]);
    const { updateBookmarkStatus, incrementBookmarkVersion } = useBookmarkContext();

    // Local copy of the server state. The row Id is kept after the first bookmark so
    // later taps toggle the same row instead of creating a new one.
    const [isBookmark, setIsBookmark] = useState<boolean>(Status === TermStatus.bookmark);
    const [userTermsId, setUserTermsId] = useState<number>(UserTermsId);
    const [isLoading, setIsLoading] = useState(false);
    const pendingRef = useRef(false);
    const BookmarkIcons = isBookmark ? BookmarkIcon : BookmarkOutlineIcon;

    // Sync when fresh data arrives from the API.
    useEffect(() => { setIsBookmark(Status === TermStatus.bookmark); }, [Status]);
    useEffect(() => { if (UserTermsId) setUserTermsId(UserTermsId); }, [UserTermsId]);

    const saveBookmark = useCallback(async (bookmarked: boolean): Promise<void> => {
      if (userTermsId) {
        await bookmarkApi.setStatus(userTermsId, bookmarked);
        return;
      }
      // No row yet: create (or reuse) it, then apply the requested state.
      const newId = await bookmarkApi.bookmark(TermId, UserId);
      if (newId) setUserTermsId(newId);
      if (!bookmarked && newId) await bookmarkApi.setStatus(newId, false);
    }, [userTermsId, TermId, UserId]);

    const handleBookmarkToggle = useCallback(
      async (event: GestureResponderEvent) => {
        event.stopPropagation?.();
        if (pendingRef.current || !TermId || !UserId) return;
        pendingRef.current = true;

        const next = !isBookmark;
        setIsBookmark(next); // optimistic
        if (!NoLoading) setIsLoading(true);
        try {
          await saveBookmark(next);
          updateBookmarkStatus(TermId, UserId, next);
          incrementBookmarkVersion(next ? 'add' : 'remove');
          if (!next) OnUnbookmark?.();
        } catch (error: any) {
          setIsBookmark(!next); // revert to the server state
          Alert.alert(ErrorTitle.m0001, errorMessageFrom(error));
        } finally {
          pendingRef.current = false;
          if (!NoLoading) setIsLoading(false);
        }
      },
      [isBookmark, TermId, UserId, NoLoading, saveBookmark, updateBookmarkStatus, incrementBookmarkVersion, OnUnbookmark]
    );

    const canToggle = Status === TermStatus.bookmark || Status === TermStatus.unbookmark;

    // Plain white bookmark in the term screen header.
    if (Variant === 'header') {
      if (!canToggle) return null;
      return (
        <S.TouchableOpacity
          className={`h-12 w-12 items-center justify-center ${ClassName ?? ''}`}
          onPress={handleBookmarkToggle}
          disabled={Disabled || isLoading}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={isBookmark ? "Remove bookmark" : "Bookmark this term"}
          accessibilityState={{ selected: isBookmark, busy: isLoading }}
        >
          <MaterialCommunityIcons name={isBookmark ? 'bookmark' : 'bookmark-outline'} size={32} color="#ffffff" />
        </S.TouchableOpacity>
      );
    }

    // Square white-on-blue button used on the Terms screen rows.
    if (Variant === 'tile') {
      return (
        <S.TouchableOpacity
          className={`h-11 w-11 rounded-xl items-center justify-center bg-white/20 border border-white/25 ${ClassName ?? ''}`}
          onPress={handleBookmarkToggle}
          disabled={!canToggle || Disabled || isLoading}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          accessibilityRole="button"
          accessibilityLabel={canToggle ? (isBookmark ? "Remove bookmark" : "Bookmark this term") : "Locked"}
          accessibilityState={{ selected: isBookmark, busy: isLoading, disabled: !canToggle }}
        >
          {isLoading && !NoLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <MaterialCommunityIcons name={!canToggle ? 'lock-outline' : isBookmark ? 'bookmark' : 'bookmark-outline'} size={22} color="#ffffff" />
          )}
        </S.TouchableOpacity>
      );
    }

    // Conditional rendering for bookmarked/unlocked state
    if (canToggle) {
      return (
        <S.TouchableOpacity
          className={`w-3/12 flex justify-center items-end h-12 pr-3 ${ClassName}`}
          onPress={handleBookmarkToggle}
          disabled={Disabled || isLoading}
          accessibilityRole="button"
          accessibilityLabel={isBookmark ? "Remove bookmark" : "Bookmark this term"}
          accessibilityState={{ selected: isBookmark, busy: isLoading }}
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
