export enum RoutesChannel {
    INDEX = "/",
    HOME = "/home",
    BOOKMARK = "/bookmark",
    AUTH = "/auth",
    UNAUTHPRIZED = "/unauthorized",
    SIGN_IN = "/sign-in",
    SIGN_UP = "/sign-up",
    FORGOT_PASSWORD = "/forgot-password",
    GOOGLE_SIGN_IN = "/improved-google-signin",
    EDIT_PROFILE = "/edit-profile",
    TERM = "/terms",
    TERM_LINE = "/term-line",
    PROFILE = "/profile",
    SETTINGS = "/settings",
    CHANGE_PASSWORD = "/change-password",
    TERMS_AND_CONDITIONS = "/terms-condition"
}

export enum ReduxChannel {
    CHAPTER_GET_ALL = 'chapters/getAllChapters',
    CHAPTER_GET = 'chapters/getChapter',
    TERM_GET_ALL = 'terms/useGetAllTermByChapter',
    TERM_GET = 'terms/useGetTerm',
    TERM_GET_ALL_BOOKMARK = 'bookmarks/useGetBookmarks',
    TERM_LINE_GET_ALL = 'termline/useGetAllTermLine'
}