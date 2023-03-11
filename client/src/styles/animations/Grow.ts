import styled, { keyframes } from "styled-components";
import BaseAnimation from "./BaseAnimation";

const growAnimation = keyframes`
    from {
        transform: scale(0, 0);
        opacity: 0;
    }

    to {
        transform: scale(1, 1);
        opacity: 1;
    }
`;

const Grow = styled(BaseAnimation)`
    animation: ${growAnimation};
`;

export { growAnimation, Grow };
export default Grow;