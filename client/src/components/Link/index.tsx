import { StyledLink, StyledLinkProps } from "./styles";
import { useNavigate } from "react-router-dom";

interface LinkProps extends Partial<StyledLinkProps> {
    href?: string;
    to?: string;
    children: React.ReactNode;
}

function Link(props: LinkProps) {
    const { href, to, children, variant = "primary", size = 1 } = props;

    const navigate = useNavigate();

    const handleClick = () => {
        if (to) navigate(to);
    };

    return (
        <StyledLink
            variant={variant}
            size={size}
            href={href}
            onClick={handleClick}
        >
            {children}
        </StyledLink>
    );
}

export default Link;
export type { LinkProps };
