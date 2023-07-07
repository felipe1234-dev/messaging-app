import styled, { css } from "styled-components";
import { spinnerAnimation } from "@styles/animations";

interface SpinnerContainerProps {
    speed: string;
}

const SpinnerContainer = styled.div<SpinnerContainerProps>`
    ${({ speed, theme }) => css`
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 100%;
        min-height: 100%;

        svg {
            font-size: 100px;
            animation: ${spinnerAnimation} ${speed} infinite linear;
            color: ${theme.icon.highlight};
        }
    `}
`;

export { SpinnerContainer };
