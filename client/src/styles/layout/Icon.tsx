import { Variant } from "@types";
import styled from "styled-components";

interface StyledIconProps {
    variant: Variant;
    size: number;
    pl: number;
    pr: number;
    pb: number;
    pt: number;
}

const StyledIcon = styled.span<StyledIconProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.text[props.variant]};
    width: ${(props) => props.size}em;
    height: auto;
    padding-top: ${({ pt }) => pt}px;
    padding-left: ${({ pl }) => pl}px;
    padding-right: ${({ pr }) => pr}px;
    padding-bottom: ${({ pb }) => pb}px;

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
    const { 
        variant = "primary", 
        size = 1,
        pl = 0,
        pr = 0,
        pb = 0,
        pt = 0
    } = props;

    return (
        <StyledIcon 
            variant={variant} 
            size={size}
            pl={pl}
            pr={pr}
            pb={pb}
            pt={pt}
        >
            {props.icon}
        </StyledIcon>
    );
}

export default Icon;
export type { IconProps };