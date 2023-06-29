import styled, { css } from "styled-components";

const time = "500ms";
const loaderSize = "50px";

interface WrapperProps {
    hidden: boolean;
}

const DarkBackground = styled.div<WrapperProps>`
    @keyframes goToBackLayerAnimation {
        ${() => {
            let css = "";
            let i = 0;
            const max = 10;

            while (i < max) {
                const percent = 0 + i + "%";

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

    opacity: 0.8;
    transition: opacity ease-in-out ${time};

    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);

    animation-name: goToBackLayerAnimation;
    animation-duration: ${time};

    ${(props) =>
        props.hidden &&
        css`
            opacity: 0;
            pointer-events: none;
        `}
`;

const LoaderContainer = styled.div`
    height: ${loaderSize};
    width: ${loaderSize};
    display: flex;
    position: relative;
`;

const LoaderFigure = styled.div`
    ${({ theme }) => css`
        @keyframes blink {
            0% {
                background-color: ${theme.background.highlight};
                width: ${loaderSize};
                height: ${loaderSize};
            }

            29% {
                background-color: ${theme.background.highlight};
            }

            30% {
                width: ${loaderSize};
                height: ${loaderSize};
                background-color: transparent;
                border-width: calc(${loaderSize} / 2);
                opacity: 1;
            }

            100% {
                width: ${loaderSize};
                height: ${loaderSize};
                border-width: 0;
                opacity: 0;
                background-color: transparent;
            }
        }

        width: ${loaderSize};
        height: ${loaderSize};
        box-sizing: border-box;
        border: 0 solid ${theme.background.highlight};
        border-radius: 50%;

        animation-name: blink;
        animation-duration: 1.15s;
        animation-timing-function: ease;
        animation-iteration-count: infinite;
    `}
`;

export { DarkBackground, LoaderContainer, LoaderFigure };
