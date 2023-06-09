import styled, { css } from "styled-components";
import { Variant } from "@types";
import { shade } from "@functions";

interface DividerProps {
    variant?: Variant;
    thickness?: number;
    vertical?: boolean;
    size?: number;
    light?: number;
    mt?: number;
    ml?: number;
    mr?: number;
    mb?: number;
    m?: number;
}

const Divider = styled.hr<DividerProps>`
    ${({
        variant = "secondary",
        thickness = 2,
        vertical = false,
        size = 1,
        light = 0,
        mt = 0,
        mb = 0,
        ml = 0,
        mr = 0,
        m = 0,
        theme,
    }) => {
        size *= 100;

        return css`
            background-color: ${shade(theme.background[variant], light)};
            height: ${vertical ? `${size}%` : `${thickness}px`};
            width: ${vertical ? `${thickness}px` : `${size}%`};
            border: none;
            ${m
                ? css`
                      margin: ${m}px;
                  `
                : css`
                      margin-top: ${mt}px;
                      margin-left: ${ml}px;
                      margin-right: ${mr}px;
                      margin-bottom: ${mb}px;
                  `}
        `;
    }}
`;

export default Divider;
export type { DividerProps };
