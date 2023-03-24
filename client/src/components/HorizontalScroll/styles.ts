import styled, { css } from "styled-components";

interface StyledHorizontalScrollProps {
    hideScrollbar: boolean;
}

const StyledHorizontalScroll = styled.div<StyledHorizontalScrollProps>`
    ${({ hideScrollbar }) => hideScrollbar && css`
        .react-horizontal-scrolling-menu--scroll-container::-webkit-scrollbar {
            display: none;
        }
        
        .react-horizontal-scrolling-menu--scroll-container {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
        }
    `}
`;

export { StyledHorizontalScroll };
export type { StyledHorizontalScrollProps };