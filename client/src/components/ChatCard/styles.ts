import styled, { css } from "styled-components";
import { shade } from "@functions";
import { showItemAnimation } from "@styles/animations";

const px = 10;
const py = 10;

interface OuterContainerProps {
    selected: boolean;
}

const OuterContainer = styled.div<OuterContainerProps>`
    ${({ selected }) => css`
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: fit-content;
        background-color: transparent;
        transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        cursor: pointer;
        border-radius: 8px;
        animation-name: ${showItemAnimation};
        animation-duration: 1s;

        &:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }

        ${selected &&
        css`
            background-color: rgba(255, 255, 255, 0.05);
        `}
    `}
`;

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: calc(100% - ${2 * px}px);
    height: fit-content;
    background-color: transparent;
    padding: ${py}px ${px}px;
    gap: 10px;
    min-width: 288px;
`;

const CardBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 5px;
    background-color: transparent;
    width: 100%;
`;

const CardInfo = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    width: 100%;
`;

const CardText = styled.span`
    ${({ theme }) => css`
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 140px;
        color: ${shade(theme.background.secondary, 0.5)};
    `}
`;

const CardSender = styled.p`
    ${({ theme }) => css`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: ${shade(theme.background.secondary, 1)};
    `}
`;

const CardDate = styled.p`
    ${({ theme }) => css`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: ${theme.text.highlight};
        font-style: italic;
    `}
`;

interface UnseenMessagesCounterProps {
    color?: string;
}

const UnseenMessagesCounter = styled.p<UnseenMessagesCounterProps>`
    ${({ color, theme }) => css`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: 40%;
        background-color: ${color || theme.background.highlight};
        color: ${theme.text.primary};
        padding: 0 8px;
        width: auto;
        height: 1.5em;
        position: absolute;
        top: 0;
        right: 0;
        animation-name: ${showItemAnimation};
        animation-duration: 1s;
    `}
`;

export {
    OuterContainer,
    InnerContainer,
    CardBody,
    CardInfo,
    CardText,
    CardDate,
    CardSender,
    UnseenMessagesCounter,
};
