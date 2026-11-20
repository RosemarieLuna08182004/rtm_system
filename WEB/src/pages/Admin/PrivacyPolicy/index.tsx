import { ButtonType, RouteChannel, SFC } from "../../../types";
import * as S from '../../../styles/Styles';
import { CustomButton, PageBreadCrumbs } from "../../../components";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <S.Divider className="mb-6">
        <S.Divider className="flex items-center gap-2 mb-2">
            <span className="text-primary">{icon}</span>
            <S.H1 className="text-base font-semibold text-zinc-800">{title}</S.H1>
        </S.Divider>
        <S.P className="text-sm text-zinc-600 leading-relaxed pl-8">{children}</S.P>
    </S.Divider>
);

export const PrivacyPolicyPage: SFC = ({ ClassName }) => {
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
                        <PageBreadCrumbs Links={links} Active="Privacy Policy" />
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
                        <GppGoodOutlinedIcon className="text-primary" style={{ fontSize: 28 }} />
                        <S.H1 className="text-xl font-bold text-zinc-800">Privacy Policy</S.H1>
                    </S.Divider>
                    <S.P className="text-xs text-zinc-400 mb-6 pl-10">Effective date: January 1, 2024 · roots & morphology</S.P>

                    <S.Divider className="border-b border-zinc-100 mb-6" />

                    <Section icon={<LockOutlinedIcon fontSize="small" />} title="Information We Collect">
                        The roots &amp; morphology admin portal collects information you provide directly — such as your name, institutional email address, and role — at the time your account is created by a system administrator. We also collect usage data such as login timestamps and actions performed within the portal (e.g., term entries created, users managed) for audit and accountability purposes.
                    </Section>

                    <Section icon={<StorageOutlinedIcon fontSize="small" />} title="How We Use Your Information">
                        Information collected is used solely to operate and maintain the portal: to authenticate your identity, enforce role-based access controls, and maintain a record of administrative actions for system integrity. We do not use your information for marketing, profiling, or any purpose outside the administration of this platform.
                    </Section>

                    <Section icon={<ShareOutlinedIcon fontSize="small" />} title="Data Sharing">
                        We do not sell, trade, or rent your personal information to third parties. Access to administrator data is restricted to authorized system administrators and, where legally required, to the institution's IT and compliance offices. No data is shared with external services beyond what is necessary to run the platform's infrastructure.
                    </Section>

                    <Section icon={<StorageOutlinedIcon fontSize="small" />} title="Data Retention">
                        Account and audit records are retained for as long as your account remains active and for a reasonable period thereafter, in accordance with the institution's records retention policy. You may request deletion of your account by contacting your system administrator.
                    </Section>

                    <Section icon={<SecurityOutlinedIcon fontSize="small" />} title="Security">
                        We apply industry-standard security practices to protect your data, including encrypted connections (HTTPS), hashed credential storage, and access logging. While we take reasonable precautions, no system can guarantee absolute security. Please report any suspected vulnerabilities to your system administrator immediately.
                    </Section>

                    <Section icon={<MailOutlineIcon fontSize="small" />} title="Contact">
                        If you have questions about this policy or wish to exercise any rights over your data, contact your institution's system administrator or the roots &amp; morphology platform team at your institution.
                    </Section>

                    <S.Divider className="border-t border-zinc-100 pt-4 mt-2">
                        <S.P className="text-xs text-zinc-400">
                            This policy applies to all users of the roots &amp; morphology admin portal. It may be updated periodically — continued use of the portal constitutes acceptance of the current policy.
                        </S.P>
                    </S.Divider>
                </S.Content>
            </S.Container>
        </>
    );
};
