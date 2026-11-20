import { ButtonType, DialogType, NotificationTable, RouteChannel, SFC } from "../../../types";
import * as S from '../../../styles/Styles'
import { PageBreadCrumbs, Skeleton, SectionHeader, CustomButton } from "../../../components";
import { ConfirmationDialog } from "../../../components/Dialogs";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useGetAllNotifications } from "../../../hooks/api/notification/useGetAllNotifications";
import { useNotificationActions } from "../../../hooks/api/notification/useNotificationActions";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

const UNREAD = 1;

/** Where clicking a notification goes. New notifications store a route; older ones a page name. */
const linkFor = (n: NotificationTable) => {
    const link = (n.LinkedComponent ?? '').trim();
    // The Sales page was removed; older checkout alerts stay readable but don't link anywhere
    if (link.startsWith('/a/sales')) return '';
    // Only pages inside the admin (/a/...): never another site, e.g. via //host or /\host
    const BACKSLASH = String.fromCharCode(92);
    if ((link === '/a' || link.startsWith('/a/')) && !link.includes('//') && !link.includes(BACKSLASH)) return link;
    if (link.toLowerCase() === 'dashboard') return RouteChannel.DASHBOARD;
    return '';
};

const iconFor = (n: NotificationTable, link: string) => {
    // Duplicate alerts link to a term or sub term; import summaries mention duplicates
    if (link.startsWith('/a/term') || /duplicate/i.test(n.Description ?? '')) return { Icon: ReportProblemOutlinedIcon, tone: 'bg-amber-50 text-amber-600' };
    if (link.startsWith('/a/user')) return { Icon: PersonAddAltOutlinedIcon, tone: 'bg-orange-50 text-orange-500' };
    if (link.startsWith('/a/sales')) return { Icon: ShoppingCartCheckoutOutlinedIcon, tone: 'bg-emerald-50 text-emerald-600' };
    return { Icon: NotificationsNoneOutlinedIcon, tone: 'bg-blue-50 text-primary' };
};

const timeAgo = (value?: Date | string) => {
    if (!value) return '';
    const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
};

export const AdminNotificationPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const { records, loading } = useGetAllNotifications()
    const { markRead, markAllRead, remove } = useNotificationActions()
    const links = [{ Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) }]

    // Local copy so read/delete update instantly without reloading the list
    const [items, setItems] = useState<NotificationTable[]>([])
    useEffect(() => setItems(records ?? []), [records])
    const [toDelete, setToDelete] = useState<NotificationTable | null>(null)

    const unreadCount = useMemo(() => items.filter(n => Number(n.Status) === UNREAD).length, [items])

    const open = async (n: NotificationTable) => {
        if (Number(n.Status) === UNREAD && await markRead(n.Id ?? 0))
            setItems(list => list.map(x => x.Id === n.Id ? { ...x, Status: 0 } : x))
        const link = linkFor(n)
        if (link) navigate(link)
    }

    const readAll = async () => {
        if (await markAllRead()) setItems(list => list.map(x => ({ ...x, Status: 0 })))
    }

    const confirmDelete = async () => {
        if (toDelete && await remove(toDelete.Id ?? 0)) setItems(list => list.filter(x => x.Id !== toDelete.Id))
        setToDelete(null)
    }

    return (
        <>
        <S.Container className={ClassName}>
            <S.PageTopBar className="breadcrumbs w-full  bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                    <PageBreadCrumbs Links={links} Active={"Notifications"} />
                    <S.Actions className="flex justify-end w-full md:w-4/6">
                        <CustomButton icon={<DoneAllIcon className="md:text-white text-primary" />} onClick={readAll} text="Mark all as read" type={ButtonType.button} disabled={loading || unreadCount === 0} />
                    </S.Actions >
            </S.PageTopBar>
            <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 px-3 py-2">
                <S.Divider className="w-full md:max-h-[calc(100vh-156px)] overflow-auto">
                    <SectionHeader ClassName="py-2 mb-2" Title="Notifications" Description="Sign-ups, checkouts and newly found duplicates in RTM. Click one to open it."
                        Badge={!loading && unreadCount > 0 ? `${unreadCount} unread` : undefined} />
                    {loading ? <Skeleton ClassName="py-8" /> : items.length === 0 ? (
                        <S.Divider className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
                            <NotificationsNoneOutlinedIcon fontSize="large" />
                            <S.Span className="text-sm">No notifications yet. New sign-ups, checkouts and duplicates will appear here.</S.Span>
                        </S.Divider>
                    ) : (
                        <S.Divider className="flex flex-col divide-y divide-slate-100">
                            {items.map(n => {
                                const unread = Number(n.Status) === UNREAD
                                const link = linkFor(n)
                                const { Icon, tone } = iconFor(n, link)
                                return (
                                    <S.Divider key={n.Id} className={`flex items-center gap-3 px-2 py-3 rounded-md ${unread ? 'bg-blue-50/60' : ''} hover:bg-slate-50`}>
                                        <button type="button" onClick={() => open(n)}
                                            className={`flex flex-1 items-center gap-3 min-w-0 text-left bg-transparent border-0 p-0 ${link || unread ? 'cursor-pointer' : 'cursor-default'}`}>
                                            <S.Span className={`w-2 h-2 rounded-full shrink-0 ${unread ? 'bg-primary' : 'bg-transparent'}`} aria-label={unread ? 'Unread' : undefined} />
                                            <S.Divider className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tone}`}><Icon fontSize="small" /></S.Divider>
                                            <S.Divider className="flex flex-col min-w-0">
                                                <S.Span className={`text-sm truncate ${unread ? 'font-semibold text-zinc-800' : 'text-zinc-600'}`}>{n.Description}</S.Span>
                                                <S.Span className="text-xs text-slate-400" title={n.DateCreated ? new Date(n.DateCreated).toLocaleString() : ''}>{timeAgo(n.DateCreated)}</S.Span>
                                            </S.Divider>
                                        </button>
                                        <button type="button" onClick={() => setToDelete(n)} aria-label="Delete notification" title="Delete"
                                            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-transparent border-0 text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer">
                                            <DeleteOutlineIcon fontSize="small" />
                                        </button>
                                    </S.Divider>
                                )
                            })}
                        </S.Divider>
                    )}
                </S.Divider>
            </S.Content>
        </S.Container>
        {toDelete && (
            <ConfirmationDialog ClassName='md:w-2/6 w-11/12' dialogType={DialogType.delete} close={() => setToDelete(null)}
                title="Delete notification" message="Delete this notification? This can't be undone." confirm={confirmDelete} />
        )}
        </>
    )
}
