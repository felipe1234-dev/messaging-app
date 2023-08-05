import styled from "styled-components";
import { paddingX, paddingY } from "../styles";

const MessageListContainer = styled.div`
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

export { MessageListContainer };
