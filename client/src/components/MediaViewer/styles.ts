import styled, { css } from "styled-components";
import { showItemAnimation } from "@styles/animations";

const MediaViewerContainer = styled.div`
    ${({ theme }) => css`
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 100px;
        max-width: 100px;
        min-height: 100px;
        max-height: 100px;
        background-color: ${theme.background.secondary};
        border-radius: 10px;
        animation-name: ${showItemAnimation};
        animation-duration: 1s;
        margin: 10px 0;
        padding: 8px;

        svg {
            width: 2.5em;
            height: auto;
        }

        img {
            width: 100px;
            height: 100px;
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
