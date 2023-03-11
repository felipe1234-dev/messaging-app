import styled, { keyframes } from "styled-components";

const props = {
    "to-top": "top",
    "to-bottom": "bottom"
};

const fadeOutAnimation = (
    mode: "to-top" | "to-bottom" = "to-bottom"
) => keyframes`
    from { ${props[mode]}: 30px; opacity: 1; }
    to { ${props[mode]}: 0; opacity: 0; }
`;

const FadeOut = styled.div`
    animation: ${fadeOutAnimation()} 0.5s ease-in-out;
`;

export { FadeOut, fadeOutAnimation };
export default FadeOut;