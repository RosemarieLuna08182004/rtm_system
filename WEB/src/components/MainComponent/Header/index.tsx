import { ButtonColor, ButtonType, HeaderProps, RouteChannel, SFC } from "../../../types";
import { cn } from "../../../utils";
import { mdiMenu } from "@mdi/js";
import { Icon } from "../../Icon";
import { CircleButton } from "../../FormInputs";
import { Avatar, InputAdornment, ListItemIcon, Menu, MenuItem, TextField } from "@mui/material";
import { colors } from "../../../styles";
import { AddNewDropDown } from "../../DropDown";
import { useAuth, useGetUnreadNotifications } from "../../../hooks";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import * as S from '../../../styles'
import { useConfirmLogout, useSearch } from "../../../context";
import { useState } from "react";

const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour < 12) return {
        text: 'Good morning',
        Icon: WbSunnyIcon,
        iconColor: '#F59E0B',
        gradient: 'linear-gradient(90deg, #EFF6FF 0%, #F8FBFF 100%)',
    };
    if (hour < 18) return {
        text: 'Good afternoon',
        Icon: WbTwilightIcon,
        iconColor: '#F97316',
        gradient: 'linear-gradient(90deg, #EFF6FF 0%, #F8FBFF 100%)',
    };
    return {
        text: 'Good evening',
        Icon: NightlightRoundIcon,
        iconColor: '#6366F1',
        gradient: 'linear-gradient(90deg, #EFF6FF 0%, #F5F3FF 100%)',
    };
};

export const Header:SFC<HeaderProps> = ({ClassName, Toggle}) => {
    const {auth} = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const confirmLogout = useConfirmLogout() // asks "Log out?" first
    const { unreadCount, refetch } = useGetUnreadNotifications()
    const { searchQuery, setSearchQuery } = useSearch()
    const [accountAnchor, setAccountAnchor] = useState<null | HTMLElement>(null)
    const isDashboard = location.pathname === '/a'
    const greeting = getGreetingData()
    const displayName = auth?.user?.Name ? auth.user.Name.charAt(0).toUpperCase() + auth.user.Name.slice(1) : 'Admin'
    const profileRoute = `/a/profile/${auth?.user?.Id ?? 0}`

    const closeAccountMenu = () => setAccountAnchor(null)
    const goTo = (route: string) => { closeAccountMenu(); navigate(route) }

    return (
        <S.Container
            className={cn("flex flex-wrap md:flex-nowrap items-center gap-3 px-4 py-3 rounded-xl border border-slate-200/70 shadow-sm", ClassName)}
            // --rtm-banner-* variables let the bar colours be changed from CSS; unset = the greeting's own colours
            style={{ background: `var(--rtm-banner-bg, ${greeting.gradient})` }}
        >
            {/* Left: menu toggle (mobile) + greeting */}
            <S.Content className="flex flex-1 items-center gap-3 min-w-0">
                <S.Span
                    onClick={Toggle}
                    role="button"
                    aria-label="Open menu"
                    className="md:hidden cursor-pointer flex items-center justify-center rounded-full w-[40px] h-[40px] shrink-0"
                    style={{ background: colors.palette.neutral['100'] }}
                >
                    <Icon icon={mdiMenu} ClassName="text-primary" />
                </S.Span>
                <S.Divider
                    className="hidden sm:flex items-center justify-center rounded-full w-[42px] h-[42px] shrink-0"
                    style={{ background: 'white', boxShadow: `0 2px 8px ${greeting.iconColor}33` }}
                >
                    <greeting.Icon style={{ color: greeting.iconColor, fontSize: 22 }} />
                </S.Divider>
                <S.Divider className="flex flex-col min-w-0">
                    <S.Span className="text-lg md:text-xl font-bold leading-tight truncate" style={{ color: `var(--rtm-banner-text, ${colors.secondary})` }}>
                        {greeting.text}<S.Span className="hidden sm:inline">, {displayName}</S.Span>!
                    </S.Span>
                    <S.Span className="hidden sm:block text-sm truncate" style={{ color: 'var(--rtm-banner-sub, #64748B)' }}>
                        {isDashboard ? "Here's what's happening in RTM today." : 'Manage the knowledge behind RTM.'}
                    </S.Span>
                </S.Divider>
            </S.Content>

            {/* Search: its own row on mobile, inline on desktop */}
            <S.Divider className="order-last basis-full md:order-none md:basis-auto md:w-[340px] lg:w-[380px]">
                <TextField
                    fullWidth
                    id="Search"
                    size="small"
                    name="filter"
                    type="search"
                    placeholder="Search terms, sub terms, volumes, users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Escape') setSearchQuery('') }}
                    inputProps={{ 'aria-label': 'Search RTM content' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" sx={{ color: '#64748B' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            background: 'white',
                            fontSize: 14,
                            "& fieldset": { borderColor: '#E2E8F0' },
                            "&:hover fieldset": { borderColor: '#CBD5E1' },
                            "&.Mui-focused fieldset": { borderColor: colors.primary, borderWidth: 1 },
                        },
                    }}
                />
            </S.Divider>

            {/* Right: (add on inner pages) + notifications + account */}
            <S.Content className="flex items-center gap-2 md:gap-3">
                {/* On the dashboard the add button lives below the top bar (see Dashboard page) */}
                {!isDashboard && <AddNewDropDown />}
                <CircleButton
                    OnClick={() => { navigate(RouteChannel.NOTIFICATIONS); refetch(); }}
                    IsNotification={unreadCount > 0}
                    BadgeCount={unreadCount}
                    Color={ButtonColor.default}
                    Title="Notifications"
                    Icon={<NotificationsIcon sx={{ color: colors.secondary }} />}
                    Type={ButtonType.button}
                />
                <S.Span className="hidden sm:block h-8 w-px bg-slate-200" />
                <button
                    type="button"
                    aria-label="Account menu"
                    aria-haspopup="menu"
                    aria-expanded={Boolean(accountAnchor)}
                    onClick={(e) => setAccountAnchor(e.currentTarget)}
                    className="flex items-center gap-2 rounded-full pr-1 md:pr-2 cursor-pointer bg-transparent border-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                    <Avatar src={auth?.user?.ProfilePhoto ?? ''} sx={{ background: colors.primary, width: 36, height: 36, fontSize: 16, fontWeight: 600 }}>
                        {auth?.user?.ProfilePhoto ? '' : displayName.charAt(0)}
                    </Avatar>
                    <S.Span className="hidden sm:block text-sm font-medium" style={{ color: `var(--rtm-banner-text, ${colors.secondary})` }}>{displayName}</S.Span>
                    <ExpandMoreIcon fontSize="small" sx={{ color: 'var(--rtm-banner-sub, #64748B)', display: { xs: 'none', sm: 'block' } }} />
                </button>
                <Menu
                    anchorEl={accountAnchor}
                    open={Boolean(accountAnchor)}
                    onClose={closeAccountMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    slotProps={{ paper: { sx: { mt: 1, minWidth: 180, borderRadius: '12px' } } }}
                >
                    <MenuItem onClick={() => goTo(profileRoute)}>
                        <ListItemIcon><PersonOutlineIcon fontSize="small" /></ListItemIcon>Profile
                    </MenuItem>
                    <MenuItem onClick={() => goTo(RouteChannel.SETTINGS)}>
                        <ListItemIcon><SettingsOutlinedIcon fontSize="small" /></ListItemIcon>Settings
                    </MenuItem>
                    <MenuItem onClick={() => { closeAccountMenu(); confirmLogout(); }}>
                        <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>Logout
                    </MenuItem>
                </Menu>
            </S.Content>
        </S.Container>
    )
}