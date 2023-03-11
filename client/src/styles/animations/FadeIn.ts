import styled, { keyframes } from "styled-components";

const props = {
    "from-top": "top",
    "from-bottom": "bottom"
};

const fadeInAnimation = (
    mode: "from-top" | "from-bottom" = "from-bottom"
) => keyframes`
  from { ${props[mode]}: 0; opacity: 0; }
  to { ${props[mode]}: 30px; opacity: 1; }
`;

const FadeIn = styled.div`
  animation: ${fadeInAnimation()} 0.5s ease-in-out;
`;

export default FadeIn;
export { fadeInAnimation, FadeIn };