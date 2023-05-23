import styled, { css } from "styled-components";
import { fadeInAnimation, fadeOutAnimation } from "@styles/animations";
import { Severity } from "@types";

const Container = styled.div`
    position: fixed;
    left: 0;
    top: 30px;
    z-index: 1;
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

const Snackbar = styled.div<SnackbarProps>`${({
    severity,
    show,
    autoHideTime,
    theme
}) => css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;

    padding: 16px;
    min-width: 100px;
    visibility: hidden;
    text-align: center;
    border-radius: 8px;
    font-size: 1em;

    background-color: ${severity ? theme.background[severity] : "rgba(255, 255, 255, 0.09)"};
    color: ${theme.text.primary};
    
    ${show && css`
        visibility: visible;
        animation-name: ${fadeInAnimation("from-top")}, ${fadeOutAnimation("to-top")};
        animation-duration: 500ms, 500ms;
        animation-delay: 0ms, ${autoHideTime + 500}ms;
        animation-iteration-count: 1, 1;
    `}
`}`;

export { Container, Snackbar };