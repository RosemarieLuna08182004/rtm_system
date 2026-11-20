import { CSSProperties } from "react";

const BLUE = '27, 66, 206'; // #1B42CE, the admin's primary blue

// Fine dot grid that is strongest behind the card and fades out toward the edges
const DOTS: CSSProperties = {
    backgroundImage: `radial-gradient(rgba(${BLUE}, 0.16) 1px, transparent 1.2px)`,
    backgroundSize: '22px 22px',
    maskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, #000 30%, transparent 100%)',
    WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, #000 30%, transparent 100%)',
};

/** Decorative dot grid behind the sign-in card; hidden from screen readers and clicks. */
export const Backdrop = () => (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={DOTS} />
);
