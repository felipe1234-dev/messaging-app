import styled, { css } from "styled-components";
import { Variant, Position } from "@types";
import { Container, ContainerProps } from "@styles/layout";

interface TabButtonsProps extends ContainerProps { }

const TabButtons = styled(Container) <TabButtonsProps>`
    position: relative;
`;

const positionToStyle = (
    position: Position,
    button: HTMLButtonElement,
    spacing: number,
    thickness: number
) => {
    switch (position) {
        case "top-left":
        case "top-right":
        case "top-center":
            return css`
                top: 0;
                left: ${button.offsetLeft - spacing / 2}px;
                width: ${button.offsetWidth - spacing}px;
                height: ${thickness}px;
            `;

        case "bottom-left":
        case "bottom-right":
        case "bottom-center":
            return css`
                bottom: 0;
                left: ${button.offsetLeft - spacing / 2}px;
                width: ${button.offsetWidth - spacing}px;
                height: ${thickness}px;
            `;
        case "center":
        case "center-left":
            return css`
                top: ${button.offsetTop - spacing / 2}px;
                left: 0;
                width: ${thickness}px;
                height: ${button.offsetHeight - spacing}px;
            `;
        case "center-right":
        default:
            return css`
                top: ${button.offsetTop - spacing / 2}px;
                left: 0;
                width: ${thickness}px;
                height: ${button.offsetHeight - spacing}px;
            `;
    }
};

interface IndicatorProps {
    variant: Variant;
    selectedButton: HTMLButtonElement;
    spacing: number;
    thickness: number;
    position: Position;
}

const Indicator = styled.div<IndicatorProps>`
    position: absolute;
    transition: all 0.5s ease-in-out;
    background-color: ${({ variant, theme }) => theme.button[variant]};
    ${({ position, selectedButton, spacing, thickness }) => positionToStyle(position, selectedButton, spacing, thickness)}
`;

export { TabButtons, Indicator };
export type { IndicatorProps };