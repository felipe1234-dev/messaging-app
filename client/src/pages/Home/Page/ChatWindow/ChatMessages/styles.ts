import styled, { css } from "styled-components";

export const paddingX = 50;
export const paddingY = 25;

interface ChatBackgroundProps {
    cover?: string;
}

const ChatBackground = styled.div<ChatBackgroundProps>`
    ${({ cover, theme }) => css`
        background-color: ${theme.background.primary};
        ${cover &&
        css`
            background-image: linear-gradient(
                    to right,
                    rgba(0, 0, 0, 0.7) 0 100%
                ),
                url("${cover}");
            background-repeat: no-repeat;
            background-position: center;
            background-attachment: fixed;
            background-size: cover;
        `}
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        flex: 1 1;
        width: 100%;
        overflow-y: hidden;
        overflow-x: hidden;
    `}
`;

export { ChatBackground };
