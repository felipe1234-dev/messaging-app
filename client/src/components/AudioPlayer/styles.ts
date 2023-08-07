import styled, { css } from "styled-components";

const AudioPlayerContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    background-color: transparent;
    width: 100%;
`;

const AudioTime = styled.p`
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

export { AudioPlayerContainer, AudioTime };
