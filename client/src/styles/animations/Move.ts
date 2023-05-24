import styled, { keyframes } from "styled-components";
import BaseAnimation from "./BaseAnimation";

const moveAnimation = keyframes`
    from {
        transform: translateX(0px)
    }

    to {
        transform: translateX(45px)
    }
`;

const Move = styled(BaseAnimation)`
    animation: ${moveAnimation};
`;

export { moveAnimation, Move };
export default Move;
