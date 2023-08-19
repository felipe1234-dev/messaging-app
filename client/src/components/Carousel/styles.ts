import styled, { css } from "styled-components";
import { Align, Direction, Justify } from "@types";

interface StyledCarouselProps {
    width: string;
    height: string;
    p?: number;
    pl?: number;
    pr?: number;
    pt?: number;
    pb?: number;
    px?: number;
    py?: number;
}

const StyledCarousel = styled.div<StyledCarouselProps>`
    ${({ width, height, p, pl, pr, pt, pb, px, py }) => css`
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: ${width};
        height: ${height};
        overflow: hidden;
        ${p
            ? css`
                  padding: ${p || 0}px;
              `
            : css`
                  padding-top: ${py ?? (pt || 0)}px;
                  padding-left: ${px ?? (pl || 0)}px;
                  padding-right: ${px ?? (pr || 0)}px;
                  padding-bottom: ${py ?? (pb || 0)}px;
              `}
    `}
`;

interface ScrollContainerProps {
    hideScrollbar: boolean;
    direction: Direction;
    align: Align;
    justify: Justify;
    gap: number;
}

const ScrollContainer = styled.div<ScrollContainerProps>`
    ${({ hideScrollbar, direction, align, justify, gap }) => css`
        display: flex;
        flex-direction: ${direction};
        align-items: ${align};
        justify-content: ${justify};
        gap: ${gap}px;
        width: 100%;
        height: 100%;
        overflow: ${hideScrollbar ? "hidden" : "auto"};
    `}
`;

export { StyledCarousel, ScrollContainer };
export type { StyledCarouselProps, ScrollContainerProps };
