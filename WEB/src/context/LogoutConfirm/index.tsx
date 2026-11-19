import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { useSignOut } from "../../hooks/useSignOut";

/**
 * Asks "Log out?" before signing out, so a stray click on Logout doesn't end the session.
 * Used by the sidebar and the account menu. (The "session expired" prompt signs out directly.)
 */

const LogoutConfirmContext = createContext<() => void>(() => {});

export const LogoutConfirmProvider = ({ children }: { children: ReactNode }) => {
    const { reSignOut } = useSignOut();
    const [open, setOpen] = useState(false);
    const [signingOut, setSigningOut] = useState(false);

    const confirmLogout = useCallback(() => setOpen(true), []);
    const close = () => { if (!signingOut) setOpen(false); };

    const logout = async () => {
        setSigningOut(true);
        try { await reSignOut(); }
        finally { setSigningOut(false); setOpen(false); }
    };

    return (
        <LogoutConfirmContext.Provider value={confirmLogout}>
            {children}
            <Dialog open={open} onClose={close} aria-labelledby="logout-confirm-title" maxWidth="xs" fullWidth>
                <DialogTitle id="logout-confirm-title" sx={{ fontWeight: 700 }}>Log out?</DialogTitle>
                <DialogContent>
                    <DialogContentText>You'll need to sign in again to use the admin.</DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button variant="contained" autoFocus onClick={close} disabled={signingOut}>Stay signed in</Button>
                    <Button color="error" startIcon={<LogoutIcon />} onClick={logout} disabled={signingOut}>
                        {signingOut ? 'Logging out…' : 'Log out'}
                    </Button>
                </DialogActions>
            </Dialog>
        </LogoutConfirmContext.Provider>
    );
};

/** Opens the "Log out?" confirmation. */
export const useConfirmLogout = () => useContext(LogoutConfirmContext);
