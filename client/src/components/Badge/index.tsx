import { BadgeContainer, StyledBadge } from "./styles";
import { StyledBadgeProps } from "./styles";

interface BadgeProps extends Partial<StyledBadgeProps> {
    badge: React.ReactNode;
    children: React.ReactNode;
}

function Badge(props: BadgeProps) {
    const { 
        position = "bottom-right", 
        badge,
        children 
    } = props;

    return (
        <BadgeContainer>
            <StyledBadge position={position}>
                {badge}
            </StyledBadge>
            {children}
        </BadgeContainer>
    );
}

export default Badge;
export type { BadgeProps };