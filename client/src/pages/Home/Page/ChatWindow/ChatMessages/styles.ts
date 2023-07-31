import styled, { css } from "styled-components";
import { showItemAnimation } from "@styles/animations";

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
    flex-direction: column-reverse;
    align-items: center;
    justify-content: flex-start;
    gap: 15px;
    flex: 100%;
    width: calc(100% - ${2 * paddingX}px);
    padding: ${paddingY}px ${paddingX}px;
    overflow-y: auto;
    overflow-x: hidden;
`;

const TimeGroupedMessages = styled.div`
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 15px;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
`;

const NewMessageContainer = styled.div`
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex: 1 1;
    gap: 8px;
    width: calc(100% - ${2 * paddingX}px);
    padding: ${paddingY / 2}px ${paddingX}px ${paddingY}px ${paddingX}px;
`;

const ReplyingMessage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
    animation-name: ${showItemAnimation};
    animation-duration: 1s;
    animation-timing-function: ease;

    p {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        @supports (-webkit-line-clamp: 6) {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: initial;
            display: -webkit-box;
            -webkit-line-clamp: 6;
            -webkit-box-orient: vertical;
        }
    }
`;

export {
    ChatBackground,
    MessageList,
    TimeGroupedMessages,
    NewMessageContainer,
    ReplyingMessage,
};
