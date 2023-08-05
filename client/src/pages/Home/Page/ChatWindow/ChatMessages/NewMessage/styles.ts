import styled from "styled-components";
import { showItemAnimation } from "@styles/animations";
import { paddingX, paddingY } from "../styles";

const NewMessageContainer = styled.div`
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex: 1 1;
    gap: 25px;
    width: calc(100% - ${2 * paddingX}px);
    padding: ${paddingY / 2}px ${paddingX}px ${paddingY}px ${paddingX}px;
`;

const MessagePreviewContainer = styled.div`
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

export { NewMessageContainer, MessagePreviewContainer };
