import styled, { keyframes } from "styled-components";
import BaseAnimation from "./BaseAnimation";

const spinnerAnimation = keyframes`
    from {
        transform: rotate(0turn);
    }

    to {
        transform: rotate(1turn);
    }
`;

const Spinner = styled(BaseAnimation)`
    animation: ${spinnerAnimation};
`;

export { spinnerAnimation, Spinner };
export default Spinner;