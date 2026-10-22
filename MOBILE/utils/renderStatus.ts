import { colors } from "@/styles";
import { TermStatus } from "@/types";
import { BookmarkIcon, BookmarkOutlineIcon, PlayButtonIcon } from "@/constants";

export const renderStatus = (Status: TermStatus | string, isChapter: boolean) => {
    const defaultColors = {
        BgColor: 'bg-gray-300 dark:bg-slate-800',
        TextColor: 'text-slate-500 dark:text-slate-400',
        IconColor: colors.palette.neutral['300'],
        Icon: BookmarkOutlineIcon,
    };

    const chapterIcons = {
        [TermStatus.unlock]: PlayButtonIcon,
        [TermStatus.bookmark]: BookmarkIcon,
        [TermStatus.unbookmark]: BookmarkOutlineIcon,
    };

    const nonChapterIcons = {
        [TermStatus.unlock]: BookmarkOutlineIcon,
        [TermStatus.bookmark]: BookmarkIcon,
        [TermStatus.unbookmark]: BookmarkOutlineIcon,
    };

    const activeColors = {
        BgColor: 'bg-blue-700',
        TextColor: 'text-white',
        IconColor: colors.white,
    };

    const icons = isChapter ? chapterIcons : nonChapterIcons;
    const selectedIcon = icons[Status] || defaultColors.Icon;
    const selectedColors = icons[Status] ? activeColors : defaultColors;

    return {
        ...selectedColors,
        Icon: selectedIcon,
    };
};