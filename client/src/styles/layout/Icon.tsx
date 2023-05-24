import styled, { css } from "styled-components";
import { Variant } from "@types";

interface StyledIconProps {
    variant: Variant;
    size: number;
    pl: number;
    pr: number;
    pb: number;
    pt: number;
}

const StyledIcon = styled.span<StyledIconProps>`
    ${({ variant, size, pl, pr, pb, pt, theme }) => css`
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.icon[variant]};
        width: ${size}em;
        height: auto;
        padding-top: ${pt}px;
        padding-left: ${pl}px;
        padding-right: ${pr}px;
        padding-bottom: ${pb}px;

        svg {
            display: block;
            width: ${size}em;
            height: auto;
        }
    `}
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
        pt = 0,
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
