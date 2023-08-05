import styled, { css } from "styled-components";
import { shade } from "@functions";
import { showItemAnimation } from "@styles/animations";

interface MessageRowProps {
    isSender: boolean;
    wasReplied: boolean;
}

const MessageRow = styled.div<MessageRowProps>`
    ${({ isSender, wasReplied }) => css`
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: ${isSender || wasReplied ? "flex-end" : "flex-start"};
        gap: 18px;
        width: 100%;
        ${wasReplied &&
        css`
            opacity: 0.5;
            cursor: pointer;
            transform: translateY(30%);
        `}
    `}
`;

interface MessageContainerProps {
    isSender: boolean;
    deleted: boolean;
    wasReplied: boolean;
}

const MessageContainer = styled.div<MessageContainerProps>`
    ${({ isSender, deleted, wasReplied }) => css`
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: ${wasReplied
            ? isSender
                ? "flex-start"
                : "flex-end"
            : isSender
            ? "flex-end"
            : "flex-start"};
        gap: 10px;
        width: ${wasReplied ? "100%" : "fit-content"};
        max-width: ${wasReplied ? "100%" : "50%"};

        ${deleted &&
        css`
            opacity: 0.5;
            pointer-events: none;
        `}
    `}
`;

const NotViewedMark = styled.div`
    ${({ theme }) => css`
        background-color: ${theme.background.highlight};
        border-radius: 50%;
        padding: 5px;
        animation-name: ${showItemAnimation};
        animation-duration: 1s;
    `}
`;

interface MessageBalloonProps {
    isSender: boolean;
    showSender: boolean;
    color: string;
    wasReplied: boolean;
    isReply: boolean;
}

const lineAmount = 6;

const MessageBalloon = styled.pre<MessageBalloonProps>`
    ${({ isSender, showSender, color, wasReplied, isReply, theme }) => css`
        background-color: ${shade(
            color || theme.background[isSender ? "highlight" : "secondary"],
            color ? (isSender ? 0 : -0.3) : isSender ? 0 : 0.1
        )};
        color: ${theme.text.primary};
        padding: 10px;
        animation-name: ${showItemAnimation};
        animation-duration: 1s;

        border-radius: 18px;
        ${wasReplied
            ? css`
            border-bottom-${!isSender ? "right" : "left"}-radius: 0;
        `
            : isReply
            ? css`
            border-top-${!isSender ? "left" : "right"}-radius: 0;
            `
            : showSender
            ? css`
            border-top-${isSender ? "right" : "left"}-radius: 0;
            `
            : ""}

        ${wasReplied &&
        css`
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;

            @supports (-webkit-line-clamp: ${lineAmount}) {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: initial;
                display: -webkit-box;
                -webkit-line-clamp: ${lineAmount};
                -webkit-box-orient: vertical;
            }
        `}
    `}
`;

const MessageActions = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5px;
    transition: opacity 0.5s ease-in;
    opacity: 0;
`;

const BalloonOverlay = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 0;
    padding: 0;

    &:hover ${MessageActions} {
        opacity: 1;
    }
`;

export {
    MessageRow,
    MessageContainer,
    MessageBalloon,
    MessageActions,
    NotViewedMark,
    BalloonOverlay,
};
