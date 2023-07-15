import { OverlayContainer, OverlayContent } from "./styles";

interface OverlayProps {
    overlay: React.ReactNode;
    children: React.ReactNode;
}

function Overlay(props: OverlayProps) {
    const { overlay, children } = props;
    return (
        <OverlayContainer>
            {children}
            <OverlayContent>{overlay}</OverlayContent>
        </OverlayContainer>
    );
}

export default Overlay;
export type { OverlayProps };
