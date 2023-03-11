import { Variant } from "@types";
import styled from "styled-components";

interface StyledIconProps {
    variant: Variant;
    size: number;
}

const StyledIcon = styled.span<StyledIconProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.text[props.variant]};
    width: ${(props) => props.size}em;
    height: auto;

    svg {
        display: block;
        width: ${(props) => props.size}em;
        height: auto;
    }
`;

interface IconProps extends Partial<StyledIconProps> {
    icon: React.ReactNode;
}

function Icon(props: IconProps) {
    const { variant = "primary", size = 1 } = props;

    return (
        <StyledIcon variant={variant} size={size}>
            {props.icon}
        </StyledIcon>
    );
}

export default Icon;
export type { IconProps };