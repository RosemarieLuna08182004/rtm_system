import { Dialog, IconButton, Tooltip } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface ZoomableImageProps {
    Src: string;
    Alt: string;
    /** Classes for the thumbnail image */
    ClassName?: string;
    OnError?: React.ReactEventHandler<HTMLImageElement>;
}

/**
 * An image that opens full size: double-click (or double-tap), the expand button,
 * or Enter when focused. In the viewer, click the image to switch between
 * "fit to screen" and actual size (scroll to pan); Esc or × closes it.
 */
export const ZoomableImage = ({ Src, Alt, ClassName, OnError }: ZoomableImageProps) => {
    const [open, setOpen] = useState(false);
    const [actualSize, setActualSize] = useState(false);
    // The thumbnail may have switched to a fallback address after an error; show that one
    const [shownSrc, setShownSrc] = useState(Src);

    const show = () => { setActualSize(false); setOpen(true); };

    return (
        <>
            <div className="group relative">
                <img
                    src={Src}
                    alt={Alt}
                    title="Double-click to view full size"
                    tabIndex={0}
                    role="button"
                    aria-label={`${Alt}. Press Enter to view full size`}
                    className={twMerge("cursor-zoom-in select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B42CE]", ClassName)}
                    onDoubleClick={show}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } }}
                    onLoad={(e) => setShownSrc((e.target as HTMLImageElement).currentSrc || Src)}
                    onError={OnError}
                    draggable={false}
                />
                <Tooltip title="View full size">
                    <IconButton
                        size="small"
                        onClick={show}
                        aria-label="View full size"
                        className="!absolute right-2 top-2 !bg-white/85 shadow hover:!bg-white md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                    >
                        <OpenInFullIcon fontSize="small" className="text-slate-700" />
                    </IconButton>
                </Tooltip>
            </div>

            <Dialog open={open} onClose={() => setOpen(false)} fullScreen aria-label={Alt}
                PaperProps={{ sx: { background: 'rgba(15, 23, 42, 0.94)' } }}>
                <div className="absolute right-3 top-3 z-10 flex gap-2">
                    <Tooltip title={actualSize ? "Fit to screen" : "Actual size"}>
                        <IconButton onClick={() => setActualSize(v => !v)} aria-label={actualSize ? "Fit to screen" : "Actual size"} className="!bg-white/10 hover:!bg-white/20">
                            {actualSize ? <ZoomOutIcon className="text-white" /> : <ZoomInIcon className="text-white" />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Open in new tab">
                        <IconButton component="a" href={shownSrc} target="_blank" rel="noopener noreferrer" aria-label="Open in new tab" className="!bg-white/10 hover:!bg-white/20">
                            <OpenInNewIcon className="text-white" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Close (Esc)">
                        <IconButton onClick={() => setOpen(false)} aria-label="Close" className="!bg-white/10 hover:!bg-white/20">
                            <CloseIcon className="text-white" />
                        </IconButton>
                    </Tooltip>
                </div>

                {/* Clicking the dark area around the image closes the viewer */}
                <div
                    className={`h-full w-full overflow-auto ${actualSize ? '' : 'flex items-center justify-center p-4 md:p-10'}`}
                    onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
                >
                    <img
                        src={shownSrc}
                        alt={Alt}
                        onClick={() => setActualSize(v => !v)}
                        className={actualSize
                            ? 'max-w-none cursor-zoom-out m-auto block'
                            : 'max-h-full max-w-full object-contain cursor-zoom-in rounded-md shadow-2xl'}
                        draggable={false}
                    />
                </div>
                <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/80">
                    {actualSize ? 'Scroll to move around · click the image to fit' : 'Click the image for actual size · Esc to close'}
                </span>
            </Dialog>
        </>
    );
};
