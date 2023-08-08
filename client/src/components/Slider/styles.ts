import styled, { css } from "styled-components";
import { Variant } from "@types";
import { shade } from "@functions";

const height = "0.5em";
const borderRadius = "5px";
const boxShadow = "0px 0px 10px";
const time = "0.5s";

interface BaseStyledSliderProps {
    variant: Variant;
    color?: string;
    percentage: number;
}

const SliderContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

interface ThumbProps extends BaseStyledSliderProps {}

const Thumb = styled.div<ThumbProps>`
    ${({ variant, color, percentage, theme }) => {
        const rangeColor = color || theme.background[variant];

        return css`
            position: absolute;
            left: ${percentage}%;
            transition: ${time} left ease-in;
            border-radius: 50%;
            background-color: ${rangeColor};
            box-shadow: ${boxShadow} ${rangeColor};
            height: 1.1em;
            width: 1.1em;
            cursor: pointer;
        `;
    }}
`;

interface ProgressbarProps extends BaseStyledSliderProps {}

const Progressbar = styled.div<ProgressbarProps>`
    ${({ variant, color, percentage, theme }) => {
        const rangeColor = color || theme.background[variant];

        return css`
            position: absolute;
            left: 0;
            width: ${percentage}%;
            transition: ${time} width ease-in;
            height: ${height};
            border-radius: ${borderRadius};
            background-color: ${rangeColor};
            box-shadow: ${boxShadow} ${rangeColor};
        `;
    }}
`;

interface SliderbarProps extends BaseStyledSliderProps {}

const Sliderbar = styled.div<SliderbarProps>`
    ${({ variant, color, theme }) => css`
        position: absolute;
        left: 0;
        width: 100%;
        height: calc(${height}*0.5);
        border-radius: ${borderRadius};
        background-color: ${shade(color || theme.background[variant], 0.1)};
    `}
`;

export { SliderContainer, Thumb, Progressbar, Sliderbar };
