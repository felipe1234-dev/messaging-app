import styled from "styled-components";

interface BaseAnimationProps {
    duration?: string;
    timingFunction?: string;
    delay?: string;
    iterationCount?: string;
    direction?: string;
    fillMode?: string;
    playState?: string;
    display?: string;
}

const BaseAnimation = styled.div<BaseAnimationProps>`
    animation-duration: ${(props) => props.duration};
    animation-timing-function: ${(props) => props.timingFunction};
    animation-delay: ${(props) => props.delay};
    animation-iteration-count: ${(props) => props.iterationCount};
    animation-direction: ${(props) => props.direction};
    animation-fill-mode: ${(props) => props.fillMode};
    animation-play-state: ${(props) => props.playState};
`;

BaseAnimation.defaultProps = {
    duration: "1s",
    timingFunction: "ease",
    delay: "0s",
    iterationCount: "1",
    direction: "normal",
    fillMode: "both",
    playState: "running",
};

export default BaseAnimation;
