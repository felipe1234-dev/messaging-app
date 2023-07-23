import styled, { css } from "styled-components";

interface ColorPickerContainerProps {
    fullWidth: boolean;
}

const ColorPickerContainer = styled.label<ColorPickerContainerProps>`
    ${({ fullWidth }) => css`
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        ${fullWidth &&
        css`
            width: 100%;
        `}

        input[type="color"] {
            position: absolute;
            left: 0;
            opacity: 0;
        }
    `}
`;

const ColorDisplay = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
`;

interface ColoredCircleProps {
    color: string;
}

const ColoredCircle = styled.div<ColoredCircleProps>`
    ${({ color }) => css`
        border-color: #ddd;
        background-color: ${color || "#ddd"};
        border-radius: 50%;
        border-width: 3px;
        border-style: solid;
        width: 40px;
        height: 40px;
        transition: opacity 0.5s ease-in;

        &:hover {
            opacity: 0.5;
        }
    `}
`;

interface ColorNameProps {
    color: string;
}

const ColorName = styled.p<ColorNameProps>`
    ${({ color }) => css`
        font-weight: bold;
        color: ${color};
    `}
`;

export { ColorPickerContainer, ColoredCircle, ColorName, ColorDisplay };
