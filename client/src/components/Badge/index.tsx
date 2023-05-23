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
        mt = 0, mb = 0,
        ml = 0, mr = 0,
        children 
    } = props;

    return (
        <BadgeContainer>
            <StyledBadge 
                position={position}
                mt={mt} mb={mb}
                ml={ml} mr={mr}    
            >
                {badge}
            </StyledBadge>
            {children}
        </BadgeContainer>
    );
}

export default Badge;
export type { BadgeProps };