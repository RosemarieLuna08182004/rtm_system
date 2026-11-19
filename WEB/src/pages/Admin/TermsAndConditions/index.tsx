import { ButtonType, RouteChannel, SFC } from "../../../types";
import * as S from '../../../styles/Styles';
import { CustomButton, PageBreadCrumbs } from "../../../components";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const Section = ({
    number,
    icon,
    title,
    children,
}: {
    number: string;
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) => (
    <S.Divider className="mb-6">
        <S.Divider className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-semibold text-zinc-400 w-5 shrink-0">{number}</span>
            <span className="text-primary">{icon}</span>
            <S.H1 className="text-base font-semibold text-zinc-800">{title}</S.H1>
        </S.Divider>
        <S.P className="text-sm text-zinc-600 leading-relaxed pl-12">{children}</S.P>
    </S.Divider>
);

export const TermsAndConditionsPage: SFC = ({ ClassName }) => {
    const navigate = useNavigate();
    const links = [
        { Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) },
        { Text: 'Settings', OnClick: () => navigate(RouteChannel.SETTINGS) },
    ];

    return (
        <>
            <S.Container className={ClassName}>
                <S.PageTopBar className="breadcrumbs w-full bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                    <S.Actions className="flex justify-between w-full items-center">
                        <PageBreadCrumbs Links={links} Active="Terms & Conditions" />
                        <CustomButton
                            icon={<ArrowBackIcon className="md:text-white text-primary" />}
                            onClick={() => navigate(RouteChannel.SETTINGS)}
                            text="Back"
                            type={ButtonType.button}
                        />
                    </S.Actions>
                </S.PageTopBar>

                <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 px-6 py-5">
                    {/* Header */}
                    <S.Divider className="flex items-center gap-3 mb-1">
                        <GavelOutlinedIcon className="text-primary" style={{ fontSize: 28 }} />
                        <S.H1 className="text-xl font-bold text-zinc-800">Terms &amp; Conditions</S.H1>
                    </S.Divider>
                    <S.P className="text-xs text-zinc-400 mb-6 pl-10">Last updated: January 1, 2024 · roots & morphology</S.P>

                    <S.Divider className="border-b border-zinc-100 mb-6" />

                    <S.P className="text-sm text-zinc-600 leading-relaxed mb-6">
                        By accessing or using the roots &amp; morphology admin portal, you agree to be bound by these Terms &amp; Conditions. If you do not agree, do not use this system. Access to this portal is granted by institutional administrators and is subject to the policies of your institution.
                    </S.P>

                    <Section number="01" icon={<VerifiedUserOutlinedIcon fontSize="small" />} title="Authorized Use">
                        This portal is provided exclusively for authorized personnel of the institution managing the roots &amp; morphology platform. Your access credentials are personal and non-transferable. You are responsible for all activity that occurs under your account. You must notify your administrator immediately if you suspect unauthorized access to your credentials.
                    </Section>

                    <Section number="02" icon={<EditNoteOutlinedIcon fontSize="small" />} title="Content Responsibility">
                        Users with write access are responsible for the accuracy and appropriateness of the content they create, edit, or import. This includes term entries, definitions, categories, and associated media. Content that is factually incorrect, plagiarized, or otherwise inappropriate may be removed, and the responsible user's access may be reviewed.
                    </Section>

                    <Section number="03" icon={<BlockOutlinedIcon fontSize="small" />} title="Prohibited Activities">
                        You may not use this portal to introduce malicious data, attempt to circumvent access controls, export data for unauthorized redistribution, or perform actions beyond the scope of your assigned role. Bulk operations such as SQL imports must be reviewed carefully — harmful scripts may result in irreversible data loss and immediate account suspension.
                    </Section>

                    <Section number="04" icon={<ReportProblemOutlinedIcon fontSize="small" />} title="Disclaimer of Warranties">
                        This system is provided "as is." While we strive for reliability, we make no guarantees of uninterrupted availability, data completeness, or freedom from errors. Scheduled and emergency maintenance may result in temporary unavailability. Critical data should be backed up through your institution's standard data management procedures.
                    </Section>

                    <Section number="05" icon={<GavelOutlinedIcon fontSize="small" />} title="Limitation of Liability">
                        The roots &amp; morphology platform team and your institution shall not be liable for any indirect, incidental, or consequential loss arising from your use of or inability to use this system, including data loss resulting from user error, unauthorized access due to compromised credentials, or system downtime.
                    </Section>

                    <Section number="06" icon={<LogoutOutlinedIcon fontSize="small" />} title="Termination of Access">
                        Your access may be suspended or revoked at any time by an administrator, with or without notice, for violation of these terms, inactivity, role change, or departure from the institution. Upon termination, your right to use the portal ceases immediately and your account data may be retained per the platform's data retention policy.
                    </Section>

                    <S.Divider className="border-t border-zinc-100 pt-4 mt-2">
                        <S.P className="text-xs text-zinc-400">
                            These terms may be updated from time to time. Continued use of the portal after changes are posted constitutes your acceptance of the revised terms. Contact your system administrator with any questions.
                        </S.P>
                    </S.Divider>
                </S.Content>
            </S.Container>
        </>
    );
};
