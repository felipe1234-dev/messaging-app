import styled, { css } from "styled-components";
import { growAnimation, moveAnimation } from "@styles/animations";

const time = "500ms";

interface WrapperProps {
    hidden: boolean;
}

const Wrapper = styled.div<WrapperProps>`
    @keyframes goToBackLayerAnimation {
        ${() => {
        let css = "";
        let i = 0;
        const max = 10;

        while (i < max) {
            const percent = (0 + i) + "%";

            css += `
                    ${percent} {
                        z-index: ${max - i};
                    }
                `;

            i += 10;
        }

        return css;
    }}
    }

    width: 100%;
    height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;
    
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;

    opacity: .8;
    transition: opacity ease-in-out ${time};

    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);

    animation-name: goToBackLayerAnimation;
    animation-duration: ${time};

    ${props => props.hidden && css`
        opacity: 0;
        pointer-events: none;
    `}
`;

const InnerWrapper = styled.div`
    height: 15px;
    width: 105px;
    display: flex;
    position: relative;
`;

const Dot = styled.div`
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: ${props => props.theme.text.primary};
    animation: ${moveAnimation} 700ms linear 0ms infinite;
    margin-right: 30px;
    
    &:first-child {
        position: absolute;
        top: 0;
        left: 0;
        animation: ${growAnimation} 700ms linear 0ms infinite;
    }
    
    &:last-child {
        position: absolute;
        top: 0;
        right: 0;
        margin-right: 0;
        animation: ${growAnimation} 700ms linear 0s infinite reverse;
    }
`;

export { Wrapper, InnerWrapper, Dot };