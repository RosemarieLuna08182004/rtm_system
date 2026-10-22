import { axiosPrivate } from '@/utils'

// Interceptors (auth header, single-flight refresh, sign-out on rejected session) are
// installed once in utils/api.ts; this hook only hands out the shared client.
export const useAxiosPrivate = () => axiosPrivate;
