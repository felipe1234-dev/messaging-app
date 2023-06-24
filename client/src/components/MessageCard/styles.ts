import styled, { css } from "styled-components";

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
}

const MessageBalloon = styled.p<MessageBalloonProps>`
    ${({ isSender, theme }) => css`
        background-color: ${
            theme.background[isSender ? "highlight" : "secondary"]
        };
        color: ${theme.text.primary};
        padding: 10px;
        border-radius: 18px;
        border-top-${isSender ? "right" : "left"}-radius: 0;
    `}
`;

export { MessageRow, MessageContainer, MessageBalloon };
