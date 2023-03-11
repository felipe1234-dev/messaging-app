import styled, { keyframes } from "styled-components";
import BaseAnimation from "./BaseAnimation";

const showItemAnimation = keyframes`
    0% {
        opacity: 0;
        transform: translate3d(0, 10px, 0);
    }
    100% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
`;

const ShowItem = styled(BaseAnimation)`
    animation-name: ${showItemAnimation};
`;

export { ShowItem, showItemAnimation };
export default ShowItem;