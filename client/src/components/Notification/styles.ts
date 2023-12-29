import styled, { css } from "styled-components";
import { fadeInAnimation, fadeOutAnimation } from "@styles/animations";
import { Severity } from "@types";

const NotificationContainer = styled.div`
    position: fixed;
    left: 0;
    top: 30px;
    z-index: 11;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
`;

interface SnackbarProps {
    severity?: Severity;
    show: boolean;
    autoHideTime: number;
}

const Snackbar = styled.div<SnackbarProps>`
    ${({ show, autoHideTime, theme }) => css`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;

        padding: 16px;
        min-width: 100px;
        visibility: hidden;
        text-align: center;
        border-radius: 8px;
        font-size: 1em;

        background-color: ${theme.background.primary};
        color: ${theme.text.primary};

        ${show &&
        css`
            visibility: visible;
            animation-name: ${fadeInAnimation("from-top")},
                ${fadeOutAnimation("to-top")};
            animation-duration: 500ms, 500ms;
            animation-delay: 0ms, ${autoHideTime + 500}ms;
            animation-iteration-count: 1, 1;
        `}
    `}
`;

export { NotificationContainer, Snackbar };
