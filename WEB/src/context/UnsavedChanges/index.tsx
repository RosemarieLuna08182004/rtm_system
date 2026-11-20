import { createContext, useCallback, useContext, useEffect, useId, useState, ReactNode } from "react";
import { useBlocker } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { RouteChannel } from "../../types";

/**
 * Warns before leaving a form with unsaved changes.
 * - In-app navigation (Back, sidebar, breadcrumbs, links): a "Discard changes?" dialog.
 * - Closing or reloading the tab: the browser's own "Leave site?" prompt.
 * One provider for the whole admin (the router allows a single blocker); each form
 * reports its state with <UnsavedChangesGuard When={dirty} />.
 */

type Report = (id: string, dirty: boolean) => void;
const UnsavedChangesContext = createContext<Report>(() => {});

export const UnsavedChangesProvider = ({ children }: { children: ReactNode }) => {
    const [dirtyForms, setDirtyForms] = useState<ReadonlySet<string>>(new Set());

    const report = useCallback<Report>((id, dirty) => {
        setDirtyForms(prev => {
            if (prev.has(id) === dirty) return prev;
            const next = new Set(prev);
            if (dirty) next.add(id);
            else next.delete(id);
            return next;
        });
    }, []);

    const hasChanges = dirtyForms.size > 0;

    // Only real page changes; logout (back to sign-in) always goes through, since it has already ended the session
    const blocker = useBlocker(({ currentLocation, nextLocation }) =>
        hasChanges && currentLocation.pathname !== nextLocation.pathname && nextLocation.pathname !== RouteChannel.INDEX);

    // If the changes went away while the dialog was opening (e.g. a save finished), just continue
    useEffect(() => {
        if (blocker.state === "blocked" && !hasChanges) blocker.proceed();
    }, [blocker, hasChanges]);

    // Closing or reloading the tab
    useEffect(() => {
        if (!hasChanges) return;
        const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [hasChanges]);

    const blocked = blocker.state === "blocked";
    return (
        <UnsavedChangesContext.Provider value={report}>
            {children}
            <Dialog open={blocked} onClose={() => blocker.reset?.()} aria-labelledby="unsaved-changes-title" maxWidth="xs" fullWidth>
                <DialogTitle id="unsaved-changes-title" sx={{ fontWeight: 700 }}>Discard unsaved changes?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You've made changes that haven't been saved. If you leave this page now, they'll be lost.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button variant="contained" autoFocus onClick={() => blocker.reset?.()}>Keep editing</Button>
                    <Button color="error" onClick={() => blocker.proceed?.()}>Discard changes</Button>
                </DialogActions>
            </Dialog>
        </UnsavedChangesContext.Provider>
    );
};

/** Put inside a form; `When` is true while it has unsaved changes. Renders nothing. */
export const UnsavedChangesGuard = ({ When }: { When: boolean }) => {
    const report = useContext(UnsavedChangesContext);
    const id = useId();
    useEffect(() => { report(id, When); }, [id, When, report]);
    useEffect(() => () => report(id, false), [id, report]); // form closed or left: not dirty any more
    return null;
};
