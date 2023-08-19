import { OverlayContainer, OverlayContent } from "./styles";

interface OverlayProps {
    overlay?: React.ReactNode;
    lockOverlay?: boolean;
    children: React.ReactNode;
}

function Overlay(props: OverlayProps) {
    const { overlay, lockOverlay = false, children } = props;
    return (
        <OverlayContainer lockOverlay={lockOverlay}>
            {children}
            {overlay && <OverlayContent>{overlay}</OverlayContent>}
        </OverlayContainer>
    );
}

export default Overlay;
export type { OverlayProps };
