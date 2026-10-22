// Every backend endpoint the app calls, in one place.
// Reads accept an AbortSignal so screens can cancel requests they no longer need.
import axios from "axios";
import { API } from "@/constants";
import { axiosPrivate } from "@/utils/api";
import { ChapterTable, ChapterTables, TermLineTables, TermTable, TermTables } from "@/types";

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface SafeUser {
  Id: number;
  AccountType: string;
  Name: string;
  Email: string;
  ProfilePhoto?: string | null;
  Coins?: number;
  IsBundle?: number;
}

export interface LoginResult {
  success: boolean;
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

export interface BookmarkedTerm {
  TermId: number;
  Term: string;
  UserTermsId: number;
  ChapterId: number;
  Status: string;
}

export interface BookmarkGroup {
  ChapterId: number;
  Title: string;
  terms: BookmarkedTerm[];
}

type Signal = AbortSignal | undefined;
const get = async <T>(url: string, signal?: Signal): Promise<T> =>
  (await axiosPrivate.get<ApiResponse<T>>(url, { signal })).data.data;

// Public endpoints (no session yet) use plain axios.
export const authApi = {
  login: async (Email: string, Password: string) =>
    (await axios.post<ApiResponse<LoginResult>>(`${API}/auth/login`, { Email, Password })).data,
  register: async (data: { Name: string; Email: string; Password: string }) =>
    (await axios.post<ApiResponse<boolean>>(`${API}/user/add`, { ...data, AccountType: "user" })).data,
  forgotPassword: async (Email: string) =>
    (await axios.post<ApiResponse<{ resetToken: string }>>(`${API}/auth/forgot-password`, { Email })).data,
  resetPassword: async (resetToken: string, Code: string, Password: string) =>
    (await axios.post<ApiResponse<boolean>>(`${API}/auth/reset-password`, { resetToken, Code, Password })).data,
  verifyPassword: async (Password: string) =>
    (await axiosPrivate.post<ApiResponse<boolean>>(`${API}/auth/verify-password`, { Password })).data,
};

export const userApi = {
  update: async (Id: number, data: { Name?: string; Email?: string; Password?: string; CurrentPassword?: string }) =>
    (await axiosPrivate.patch<ApiResponse<boolean>>(`${API}/user/update/${Id}`, data)).data,
};

export const chapterApi = {
  getAll: (UserId: number, signal?: Signal) => get<ChapterTables>(`${API}/user/term/get-all-chapters/${UserId}`, signal),
  get: async (ChapterId: number, UserId: number, signal?: Signal) =>
    (await get<ChapterTable[]>(`${API}/user/term/get-chapter/${ChapterId}/${UserId}`, signal))?.[0],
};

export const termApi = {
  getAllByChapter: (ChapterId: number, UserId: number, signal?: Signal) =>
    get<TermTables>(`${API}/user/term/get-all-terms-by-chapter/${ChapterId}/${UserId}`, signal),
  get: async (TermId: number, UserId: number, signal?: Signal) =>
    (await get<TermTable[]>(`${API}/user/term/get-term/${TermId}/${UserId}`, signal))?.[0],
  getSubTerms: (TermId: number, signal?: Signal) => get<TermLineTables>(`${API}/term/line/get-all/${TermId}`, signal),
};

export interface IndexChapter {
  ChapterId: number;
  Title: string;
  Status: string;     // "Unlock" | "Lock"
  TermCount: number;
}

export interface IndexTerm {
  TermId: number;
  Term: string;
  ChapterId: number;
}

export interface TermIndex {
  chapters: IndexChapter[];
  terms: IndexTerm[];
}

export interface RootTerm extends IndexTerm {
  ChapterTitle: string;
  Status: string;
}

export interface NewTerm extends RootTerm {
  DateCreated: string;
}

export const studyApi = {
  // Every term with its volume and lock status (search, Home, progress).
  getIndex: (signal?: Signal) => get<TermIndex>(`${API}/user/term/me/index`, signal),
  // Terms sharing a root word, e.g. "Ren".
  getByRoot: (root: string, signal?: Signal) =>
    get<RootTerm[]>(`${API}/user/term/me/by-root?root=${encodeURIComponent(root)}`, signal),
  // The most recently added terms, newest first.
  getNewTerms: (limit: number, signal?: Signal) => get<NewTerm[]>(`${API}/user/term/me/new-terms?limit=${limit}`, signal),
};

export const bookmarkApi = {
  getMine: (signal?: Signal) => get<BookmarkGroup[]>(`${API}/user/term/me/bookmarks`, signal),
  // Creates (or re-uses) the user's bookmark row and returns its Id.
  bookmark: async (TermId: number, UserId: number) =>
    Number((await axiosPrivate.post<ApiResponse<{ UserTermsId: number }>>(`${API}/user/term/bookmark/${TermId}/${UserId}`)).data.data?.UserTermsId ?? 0),
  setStatus: async (UserTermsId: number, bookmarked: boolean) =>
    (await axiosPrivate.patch<ApiResponse<boolean>>(`${API}/user/term/unbookmark/${UserTermsId}`, { Status: bookmarked ? 1 : 0 })).data,
};
