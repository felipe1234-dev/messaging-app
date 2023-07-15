import styled from "styled-components";

const OverlayContent = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    transition: opacity 0.5s ease;
    background-color: transparent;
`;

const OverlayContainer = styled.div`
    position: relative;
    width: fit-content;
    height: fit-content;

    &:hover ${OverlayContent} {
        opacity: 1;
    }
`;

export { OverlayContainer, OverlayContent };
