import styled, { css } from "styled-components";
import { shade } from "@functions";

interface MessageRowProps {
    isSender: boolean;
}

const MessageRow = styled.div<MessageRowProps>`
    ${({ isSender }) => css`
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: ${isSender ? "flex-end" : "flex-start"};
        gap: 18px;
        width: 100%;
    `}
`;

interface MessageContainerProps {
    isSender: boolean;
    deleted: boolean;
}

const MessageContainer = styled.div<MessageContainerProps>`
    ${({ isSender, deleted }) => css`
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: ${isSender ? "flex-end" : "flex-start"};
        gap: 10px;
        width: fit-content;

        ${deleted &&
        css`
            opacity: 0.5;
            pointer-events: none;
        `}
    `}
`;

interface MessageBalloonProps {
    isSender: boolean;
    showSender: boolean;
    color: string;
}

const MessageBalloon = styled.p<MessageBalloonProps>`
    ${({ isSender, showSender, color, theme }) => css`
        background-color: ${shade(
            color || theme.background[isSender ? "highlight" : "secondary"],
            color ? (isSender ? 0 : -0.3) : isSender ? 0 : 0.1
        )};
        color: ${theme.text.primary};
        padding: 10px;
        border-radius: 18px;
        ${showSender &&
        css`border-top-${isSender ? "right" : "left"}-radius: 0;`}
    `}
`;

interface MessageActionsProps {
    isSender: boolean;
}

const leftOffset = 30;

const MessageActions = styled.div<MessageActionsProps>`
    ${({ isSender }) => css`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 8px;
        height: 100%;
        position: absolute;
        ${isSender
            ? css`
                  left: -${leftOffset}px;
              `
            : css`
                  right: -${leftOffset}px;
              `}
    `}
`;

export { MessageRow, MessageContainer, MessageBalloon, MessageActions };
