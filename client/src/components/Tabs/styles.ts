import styled, { css } from "styled-components";
import { Variant, Position } from "@types";
import { Container, ContainerProps } from "@styles/layout";

interface TabButtonsProps extends ContainerProps {}

const TabButtons = styled(Container)<TabButtonsProps>`
    position: relative;
`;

const positionToStyle = (
    position: Position,
    button: HTMLButtonElement,
    offset: number,
    margin: number,
    thickness: number
) => {
    switch (position) {
        case "top-center":
            return css`
                top: ${margin};
                left: ${button.offsetLeft + offset / 2}px;
                width: ${button.offsetWidth - offset}px;
                height: ${thickness}px;
            `;

        case "bottom-center":
            return css`
                bottom: ${margin};
                left: ${button.offsetLeft + offset / 2}px;
                width: ${button.offsetWidth - offset}px;
                height: ${thickness}px;
            `;
        case "center":
        case "center-left":
            return css`
                top: ${button.offsetTop + offset / 2}px;
                left: ${margin}px;
                width: ${thickness}px;
                height: ${button.offsetHeight - offset}px;
            `;
        case "center-right":
        default:
            return css`
                top: ${button.offsetTop + offset / 2}px;
                right: ${margin};
                width: ${thickness}px;
                height: ${button.offsetHeight - offset}px;
            `;
    }
};

interface IndicatorProps {
    variant: Variant;
    selectedButton: HTMLButtonElement;
    offset: number;
    margin: number;
    thickness: number;
    position: Position;
    borderRadius: number;
}

const Indicator = styled.div<IndicatorProps>`
    ${({
        variant,
        position,
        selectedButton,
        offset,
        margin,
        thickness,
        borderRadius,
        theme,
    }) => css`
        position: absolute;
        transition: all 0.3s ease-in-out;
        background-color: ${theme.background[variant]};
        border-radius: ${borderRadius}px;
        ${positionToStyle(position, selectedButton, offset, margin, thickness)}
    `}
`;

export { TabButtons, Indicator };
export type { IndicatorProps };
