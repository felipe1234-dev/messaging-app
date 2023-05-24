import styled, { css } from "styled-components";
import { Variant } from "@types";

interface StyledIconProps {
    variant: Variant;
    size: number;
    pl: number;
    pr: number;
    pb: number;
    pt: number;
    px?: number;
    py?: number;
}

const StyledIcon = styled.span<StyledIconProps>`
    ${({ variant, size, pl, pr, pb, pt, px, py, theme }) => css`
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.icon[variant]};
        width: fit-content;
        height: fit-content;
        padding-top: ${py ?? pt}px;
        padding-left: ${px ?? pl}px;
        padding-right: ${px ?? pr}px;
        padding-bottom: ${py ?? pb}px;

        svg {
            display: block;
            width: 1em;
            height: auto;
            transform: scale(${size});
        }
    `}
`;

interface IconProps extends Partial<StyledIconProps> {
    icon: React.ReactNode;
}

function Icon(props: IconProps) {
    const {
        icon,
        variant = "primary",
        size = 1,
        pl = 0,
        pr = 0,
        pb = 0,
        pt = 0,
        px,
        py,
    } = props;

    return (
        <StyledIcon
            variant={variant}
            size={size}
            pl={pl}
            pr={pr}
            pb={pb}
            pt={pt}
            px={px}
            py={py}
        >
            {icon}
        </StyledIcon>
    );
}

export default Icon;
export { StyledIcon };
export type { IconProps, StyledIconProps };
