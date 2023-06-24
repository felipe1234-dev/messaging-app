import styled, { css } from "styled-components";

const padding = 50;

const MessagesContainer = styled.div`
    ${({ theme }) => css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        flex: 1 1;
        width: calc(100% - ${2 * padding}px);
        padding: ${padding}px;
        background-color: ${theme.background.primary};
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
    `}
`;

const NewMessageContainer = styled.div`
    position: fixed;
    bottom: 0;
`;

interface MessageBoxProps {
    isSender: boolean;    
}

const MessageBox = styled.div<MessageBoxProps>`${({ isSender, theme }) => css`
    background-color: ${theme.background[isSender ? "highlight" : "secondary"]};
    color: ${theme.text.primary};
    border-radius: 18px;
    padding: 10px;
`}`;

export { MessagesContainer, NewMessageContainer, MessageBox };
