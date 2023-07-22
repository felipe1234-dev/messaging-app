import styled, { css } from "styled-components";

const paddingX = 50;
const paddingY = 25;

interface MessageListProps {
    cover?: string;
}

const MessageList = styled.div<MessageListProps>`
    ${({ cover }) => css`
        position: relative;
        background-color: transparent;
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
        gap: 15px;
        width: calc(100% - ${2 * paddingX}px);
        padding: ${paddingY}px ${paddingX}px;
        overflow-y: auto;
        overflow-x: hidden;
    `}
`;

const NewMessageContainer = styled.div`
    position: fixed;
    bottom: 0;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex: 1 1;
    width: calc(100% - ${2 * paddingX}px);
    padding: ${paddingY / 2}px ${paddingX}px ${paddingY}px ${paddingX}px;
`;

export { MessageList, NewMessageContainer };
