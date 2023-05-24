import styled, { css } from "styled-components";

interface OuterWrapperProps {
    width: string;
    height: string;
}

const OuterWrapper = styled.span<OuterWrapperProps>`
    ${({ width, height }) => css`
        position: relative;
        width: ${width};
        height: ${height};
    `}
`;

interface IconWrapperProps {
    top: number;
    left: number;
    zIndex: number;
}

const IconWrapper = styled.span<IconWrapperProps>`
    ${({ top, left, zIndex }) => css`
        position: absolute;
        top: ${top}px;
        left: ${left}px;
        z-index: ${zIndex};
    `}
`;

export { OuterWrapper, IconWrapper };
export type { IconWrapperProps };
