import { RouteChannel, SFC } from "../../../types";
import * as S from '../../../styles/Styles'
import { PageBreadCrumbs, SectionHeader } from "../../../components";
import MdiIcon from "@mdi/react";
import { useNavigate } from "react-router-dom";
import { mdiAccountCircleOutline, mdiBellOutline, mdiChevronRight, mdiDatabaseImportOutline, mdiFileDocumentOutline, mdiShieldLockOutline } from "@mdi/js";
import { useAuth } from "../../../hooks";

interface SettingItem { icon: string; title: string; description: string; to: string }
interface SettingGroup { title: string; description: string; items: SettingItem[] }

/** One clickable setting: icon, name, one-line description, chevron. */
const SettingRow = ({ icon, title, description, onClick }: Omit<SettingItem, 'to'> & { onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className="group flex w-full items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B42CE]"
    >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary group-hover:bg-white">
            <MdiIcon path={icon} size="24px" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-semibold text-slate-900">{title}</span>
            <span className="text-sm text-slate-500">{description}</span>
        </span>
        <span className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#1B42CE]">
            <MdiIcon path={mdiChevronRight} size="22px" />
        </span>
    </button>
);

export const AdminSettingsPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const { auth } = useAuth();
    const links = [
        { Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) },
    ]

    const groups: SettingGroup[] = [
        {
            title: 'Account',
            description: 'Your own details and alerts.',
            items: [
                { icon: mdiAccountCircleOutline, title: 'My profile', description: 'Name, email and password', to: `/a/profile/${auth?.user?.Id ?? 0}` },
                { icon: mdiBellOutline, title: 'Notifications', description: 'Sign-ups and duplicate alerts', to: RouteChannel.NOTIFICATIONS },
            ],
        },
        {
            title: 'Data',
            description: 'Bring content into RTM in bulk.',
            items: [
                { icon: mdiDatabaseImportOutline, title: 'Import data', description: 'Add terms and sub terms from Excel, CSV or SQL', to: RouteChannel.TERM_IMPORT },
            ],
        },
        {
            title: 'Legal',
            description: 'What users agree to when they use the app.',
            items: [
                { icon: mdiShieldLockOutline, title: 'Privacy Policy', description: 'How user data is used, and their rights', to: RouteChannel.PRIVACY_POLICY },
                { icon: mdiFileDocumentOutline, title: 'Terms & Conditions', description: 'Acceptable use and access rules', to: RouteChannel.TERMS_AND_CONDITIONS },
            ],
        },
    ];

    return (
        <>
            <S.Container className={ClassName}>
                <S.PageTopBar className="breadcrumbs w-full  bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                        <PageBreadCrumbs Links={links} Active="Settings" />
                </S.PageTopBar>
                <S.Content className="flex w-full flex-col gap-6 rounded-md bg-white px-4 py-5 md:px-6">
                    <SectionHeader Title="Settings" Description="Your account, data tools and the app's legal pages." />
                    {groups.map(group => (
                        <section key={group.title} aria-labelledby={`settings-${group.title}`} className="flex flex-col gap-3">
                            <div className="flex flex-col">
                                <h2 id={`settings-${group.title}`} className="text-xs font-semibold uppercase tracking-wider text-primary">{group.title}</h2>
                                <span className="text-sm italic text-slate-500">{group.description}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                {group.items.map(item => (
                                    <SettingRow key={item.title} icon={item.icon} title={item.title} description={item.description} onClick={() => navigate(item.to)} />
                                ))}
                            </div>
                        </section>
                    ))}
                </S.Content>
            </S.Container>
        </>
    )
}
