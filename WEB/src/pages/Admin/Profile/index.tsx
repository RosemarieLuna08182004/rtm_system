import { ButtonType, RouteChannel, SFC } from "../../../types";
import * as S from '../../../styles/Styles'
import { ChangePasswordForm, CustomButton, PageBreadCrumbs, Skeleton, UserForm } from "../../../components";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockIcon from '@mui/icons-material/Block';
import { useAuth, useToggle } from "../../../hooks";
import { Suspense } from "react";

export const AdminProfilePage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const { Id } = useParams<{ Id?: string }>();
    const { auth } = useAuth();
    const [isEdit, toggleEdit ] = useToggle(false);

    const isOwner = auth?.user?.Id !== undefined && String(auth.user.Id) === String(Id);

    if (!isOwner) {
        return (
            <S.Container className={ClassName}>
                <S.Main className="grid place-items-center px-6 py-24 sm:py-56 lg:px-8">
                    <S.Content className="text-center">
                        <BlockIcon className="text-primary" style={{ fontSize: 48 }} />
                        <S.H1 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-5xl">
                            Access Denied
                        </S.H1>
                        <S.P className="mt-6 text-base leading-7 text-gray-600">
                            You do not have permission to view or edit this profile.
                        </S.P>
                        <S.Content className="mt-10 flex items-center justify-center gap-x-6">
                            <CustomButton
                                icon={<ArrowBackIcon className="md:text-white text-primary" />}
                                onClick={() => navigate(RouteChannel.DASHBOARD)}
                                text="Back to Dashboard"
                                type={ButtonType.button}
                            />
                        </S.Content>
                    </S.Content>
                </S.Main>
            </S.Container>
        );
    }
    const links = [
        { Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) },
    ]

    return (
        <>
            <S.Container className={ClassName}>
                <S.PageTopBar className="breadcrumbs w-full  bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]"> 
                    <S.Actions className="flex justify-between w-full items-center">
                        <PageBreadCrumbs Links={links} Active="Profile"/>
                        <S.Actions className="flex justify-end gap-2">
                            {/* Once editing, the button goes away: changes still need Save, and nothing changes without it */}
                        {!isEdit && <CustomButton icon={<EditIcon className="md:text-white text-primary" />} onClick={toggleEdit} text='Edit' type={ButtonType.button}/>}
                            <CustomButton  icon={<ArrowBackIcon className="md:text-white text-primary" />} onClick={()=>navigate(RouteChannel.DASHBOARD)} text={'Back'} type={ButtonType.button} />
                        </S.Actions >
                    </S.Actions>
                </S.PageTopBar>
                <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 flex items-center px-3 py-2">
                    <Suspense fallback={<Skeleton />}>
                        <UserForm  Title="Profile" Description="Your administrator account details." IsEdit={!isEdit}/>
                    </Suspense>
                </S.Content>
                <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 flex items-center px-3 py-2">
                    <ChangePasswordForm />
                </S.Content>
            </S.Container> 
        </>
    )
}