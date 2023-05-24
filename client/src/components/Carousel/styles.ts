import styled, { css } from "styled-components";

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
        flex-direction: center;
        align-items: center;
        justify-content: center;
        width: ${width};
        height: ${height};
        overflow: hidden;
        ${p
            ? css`
                  padding: ${p}px;
              `
            : css`
                  padding-top: ${py ?? pt}px;
                  padding-left: ${px ?? pl}px;
                  padding-right: ${px ?? pr}px;
                  padding-bottom: ${py ?? pb}px;
              `}
    `}
`;

interface ScrollContainerProps {
    hideScrollbar: boolean;
    direction: "row" | "column";
    align: "start" | "end" | "center";
    justify:
        | "center"
        | "start"
        | "end"
        | "space-between"
        | "space-around"
        | "space-evenly";
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
