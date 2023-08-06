import styled, { css } from "styled-components";
import { StyledButton } from "../Button/styles";
import { showItemAnimation } from "@styles/animations";

const AudioRecorderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;

    ${StyledButton} {
        animation-name: ${showItemAnimation};
        animation-duration: 0.5s;
    }
`;

const AudioDuration = styled.p`
    ${({ theme }) => css`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: fit-content;
        color: ${theme.text.highlight};
    `}
`;

export { AudioRecorderContainer, AudioDuration };
