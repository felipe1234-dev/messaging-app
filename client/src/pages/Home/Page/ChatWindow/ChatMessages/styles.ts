import styled, { css } from "styled-components";

const paddingX = 50;
const paddingY = 25;

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

const MessageList = styled.div`
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 15px;
    width: calc(100% - ${2 * paddingX}px);
    padding: ${paddingY}px ${paddingX}px;
    overflow-y: auto;
    overflow-x: hidden;
`;

const NewMessageContainer = styled.div`
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex: 1 1;
    width: calc(100% - ${2 * paddingX}px);
    padding: ${paddingY / 2}px ${paddingX}px ${paddingY}px ${paddingX}px;
`;

export { ChatBackground, MessageList, NewMessageContainer };
