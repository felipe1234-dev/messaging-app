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
}

const MessageContainer = styled.div<MessageContainerProps>`
    ${({ isSender }) => css`
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: ${isSender ? "flex-end" : "flex-start"};
        gap: 10px;
        width: fit-content;
    `}
`;

interface MessageBalloonProps {
    isSender: boolean;
    showSender: boolean;
}

const MessageBalloon = styled.p<MessageBalloonProps>`
    ${({ isSender, showSender, theme }) => css`
        background-color: ${shade(
            theme.background[isSender ? "highlight" : "secondary"],
            isSender ? 0 : 0.1
        )};
        color: ${theme.text.primary};
        padding: 10px;
        border-radius: 18px;
        ${showSender &&
        css`border-top-${isSender ? "right" : "left"}-radius: 0;`}
    `}
`;

export { MessageRow, MessageContainer, MessageBalloon };
