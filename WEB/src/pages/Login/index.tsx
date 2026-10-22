import { Form, Formik } from "formik";
import { CustomButton, Input } from "../../components";
import { ButtonType, LoginTable, Roles, RouteChannel, SFC, UserTable } from "../../types";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL, Error, loginFormValues, loginInitial } from "../../shared";
import { useAuth } from "../../hooks";
import LoginIcon from '@mui/icons-material/Login';
import { loginValidator } from "../../validators";
import * as S from '../../styles/Styles'
import { twMerge } from "tailwind-merge";

export const PageLogin: SFC = ({ ClassName }) => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate();
    const { auth, setAuth } = useAuth();

    useEffect(()=>{
        if (auth?.user) navigate(RouteChannel.DASHBOARD)
    },[auth])
    
    const handleSubmit = async (values: loginFormValues): Promise<void> => {
        const data: LoginTable = { ...values };
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, data, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
              });
            if (response.data.data.success) {
                const user: UserTable = response.data.data.user;
                const roles: Roles = response.data.data.user.AccountType;
                const accessToken: string = response.data.data.accessToken;
                const refreshToken: string = response.data.data.refreshToken;
                setAuth({ user, roles, accessToken, refreshToken });
                navigate(RouteChannel.DASHBOARD, { replace: true });
            } else  setErrorMessage(Error.m00019);
        } catch (error: any) {
            setErrorMessage(Error.m00019);
        }
    };

    return (
        <>
            <S.Container className={twMerge("bg-slate-100 ", ClassName)}>
                <S.Container className="flex w-screen h-screen justify-center items-center px-3">
                    <S.Content className="md:w-4/12 w-full bg-white p-5 rounded-lg shadow-lg">
                        <S.Content className="w-full flex justify-center mb-2">
                            <img src="/logo.png" className="w-10 h-10"/>
                        </S.Content>
                        <S.Content className="mb-5">
                            <S.Span className="text-primary text-3xl">Sign In</S.Span>
                        </S.Content>
                        <S.Content className="mb-5">
                            <Formik
                                initialValues={loginInitial}
                                onSubmit={handleSubmit}
                                validateOnMount={false}
                                validationSchema={loginValidator}
                            >
                                {({ errors, touched, isSubmitting, handleChange }) => (
                                    <Form>
                                        <Input
                                            ClassName="mb-3 text-slate-100"
                                            errors={errors}
                                            type="text"
                                            label="Email"
                                            name="Email"
                                            touched={touched}
                                            onChange={handleChange}
                                        />
                                        <Input
                                            ClassName="text-zinc-900 mb-3"
                                            errors={errors}
                                            type="password"
                                            label="Password"
                                            name="Password"
                                            touched={touched}
                                            onChange={handleChange}
                                        />
                                        {/*<S.Divider className="w-full mb-3 flex justify-between items-center">
                                            <S.Span className="text-zinc-600 text-light text-xs cursor-pointer " onClick={() => navigate(RouteChannel.FORGOT_PASSWORD)}>Forgot Password?</S.Span>
                                        </S.Divider>*/}
                                        <CustomButton icon={<LoginIcon/>} text={"Sign In"} ClassName="w-full" disabled={ isSubmitting} type={ButtonType.submit} morph={false}/>
                                    </Form>
                                )}
                            </Formik>
                            <S.Divider className="text-red-500 mt-3">
                                {errorMessage && <S.Span>{errorMessage}</S.Span>}
                            </S.Divider>
                            {/*<S.Divider className="flex justify-center mt-3">
                                <S.Span className="text-zinc-700 text-light text-xs cursor-pointer font-serif" onClick={() => navigate('/sign-up')}>Dont have an account yet?</S.Span>
                            </S.Divider>*/}
                        </S.Content>
                    </S.Content>
                </S.Container>
            </S.Container>
        </>
    );
};
