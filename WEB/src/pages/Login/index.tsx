import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { LoginTable, Roles, RouteChannel, SFC, UserTable } from "../../types";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL, loginFormValues, loginInitial } from "../../shared";
import { useAuth } from "../../hooks";
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { CircularProgress } from "@mui/material";
import { loginValidator } from "../../validators";
import { twMerge } from "tailwind-merge";
import { Backdrop } from "./Backdrop";

const MESSAGES = {
    wrongCredentials: 'Incorrect email or password. Please try again.',
    notAdmin: "This account doesn't have access to the admin panel.",
    offline: "Can't reach the server. Check your connection and try again.",
    tooMany: 'Too many sign-in attempts. Please wait a few minutes and try again.',
    unknown: 'Something went wrong while signing in. Please try again.',
};

/** Turns a failed request into a message that says what actually went wrong. */
const loginError = (error: any): string => {
    const status = error?.response?.status;
    if (!error?.response) return MESSAGES.offline; // no answer at all: offline, or the server is down
    if (status === 429) return error.response.data?.message || MESSAGES.tooMany; // includes the wait time
    if (status === 400 || status === 401) return MESSAGES.wrongCredentials;
    return MESSAGES.unknown;
};

const fieldClass = (hasError: boolean) => twMerge(
    "w-full h-11 rounded-lg border bg-white px-3 text-[15px] text-slate-900 outline-none transition-colors",
    "hover:border-slate-300 focus:border-[#1B42CE] focus:ring-2 focus:ring-blue-100",
    // Browsers paint saved (autofilled) fields light blue; keep them white like the rest
    "autofill:shadow-[inset_0_0_0_1000px_#fff] autofill:[-webkit-text-fill-color:#0f172a]",
    hasError ? "border-red-400" : "border-slate-200"
);

export const PageLogin: SFC = ({ ClassName }) => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { auth, setAuth } = useAuth();

    useEffect(() => {
        if (auth?.user) navigate(RouteChannel.DASHBOARD)
    }, [auth])

    const handleSubmit = async (values: loginFormValues, { setSubmitting }: FormikHelpers<loginFormValues>): Promise<void> => {
        setErrorMessage('');
        const data: LoginTable = { ...values, Email: values.Email.trim() };
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, data, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.data?.data?.success) { setErrorMessage(MESSAGES.wrongCredentials); return; }
            const user: UserTable = response.data.data.user;
            const roles: Roles = response.data.data.user.AccountType;
            // App users have valid accounts but no business in the admin panel
            if (roles !== Roles.admin) { setErrorMessage(MESSAGES.notAdmin); return; }
            setAuth({ user, roles, accessToken: response.data.data.accessToken, refreshToken: response.data.data.refreshToken });
            navigate(RouteChannel.DASHBOARD, { replace: true });
        } catch (error: any) {
            setErrorMessage(loginError(error));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className={twMerge("relative overflow-hidden min-h-screen w-screen bg-slate-100 flex items-center justify-center px-4 py-10", ClassName)}>
            <Backdrop />
            <div className="relative w-full max-w-[400px] rounded-xl bg-white p-6 sm:p-8 shadow-lg">
                {/* Brand, with a faint divider under it */}
                <div className="flex flex-col items-center text-center mb-5 pb-5 border-b border-slate-300">
                    <img src="/logo.png" alt="" className="w-11 h-11 mb-1.5" />
                    <span className="text-sm text-slate-500">Roots, Terms, Morphology</span>
                    <span className="mt-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-primary">Admin panel</span>
                </div>

                <div className="mb-4 text-center">
                    <h1 className="text-2xl font-semibold text-slate-900">Welcome Back!</h1>
                    <p className="text-sm italic text-slate-500 mt-1">Sign in to manage RTM content.</p>
                </div>

                <Formik initialValues={loginInitial} onSubmit={handleSubmit} validateOnMount={false} validateOnBlur={false} validationSchema={loginValidator}>
                    {({ errors, touched, isSubmitting, handleChange }) => {
                        // Typing again clears the last sign-in error
                        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (errorMessage) setErrorMessage(''); handleChange(e); };
                        return (
                            <Form noValidate>
                                <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <Field id="login-email" name="Email" type="email" autoComplete="username" autoFocus
                                    onChange={onChange} className={fieldClass(!!(errors.Email && touched.Email))}
                                    aria-invalid={!!(errors.Email && touched.Email)} aria-describedby="login-email-error" />
                                <div id="login-email-error" className="min-h-[20px] text-xs text-red-500 mt-1"><ErrorMessage name="Email" /></div>

                                <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1 mt-1">Password</label>
                                <div className="relative">
                                    <Field id="login-password" name="Password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                                        onChange={onChange} className={twMerge(fieldClass(!!(errors.Password && touched.Password)), "pr-11")}
                                        aria-invalid={!!(errors.Password && touched.Password)} aria-describedby="login-password-error" />
                                    <button type="button" onClick={() => setShowPassword(v => !v)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B42CE]">
                                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </button>
                                </div>
                                <div id="login-password-error" className="min-h-[20px] text-xs text-red-500 mt-1"><ErrorMessage name="Password" /></div>

                                {errorMessage && (
                                    <div role="alert" className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                                        <ErrorOutlineIcon fontSize="small" className="mt-px shrink-0 text-red-500" />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <button type="submit" disabled={isSubmitting}
                                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-[15px] font-semibold text-white shadow-sm shadow-blue-900/20 transition-all hover:bg-[#1636A8] hover:shadow-md active:scale-[0.99] disabled:cursor-wait disabled:opacity-80 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2">
                                    {isSubmitting
                                        ? <><CircularProgress size={18} sx={{ color: 'white' }} /> Signing in…</>
                                        : <>Sign in <ArrowForwardRoundedIcon fontSize="small" className="transition-transform group-hover:translate-x-0.5" /></>}
                                </button>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </main>
    );
};
