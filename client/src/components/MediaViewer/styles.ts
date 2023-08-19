import styled, { css } from "styled-components";
import { showItemAnimation } from "@styles/animations";

const size = "250px";

const MediaViewerContainer = styled.div`
    ${({ theme }) => css`
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: ${size};
        max-width: ${size};
        min-height: ${size};
        max-height: ${size};
        background-color: ${theme.background.secondary};
        border-radius: 10px;
        animation-name: ${showItemAnimation};
        animation-duration: 1s;
        margin: 10px 0;

        svg {
            width: 2.5em;
            height: auto;
        }

        img {
            width: ${size};
            height: ${size};
            border-radius: 10px;
        }
    `}
`;

const MediaViewerrActions = styled.div`
    position: absolute;
    right: -10px;
    bottom: -10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
`;

export { MediaViewerContainer, MediaViewerrActions };
