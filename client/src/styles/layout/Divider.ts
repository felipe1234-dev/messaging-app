import styled, { css } from "styled-components";
import { Variant } from "@types";

interface DividerProps {
    variant?: Variant;
    thickness?: number;
    vertical?: boolean;
}

const Divider = styled.hr<DividerProps>`${({ 
    variant = "primary",
    thickness = 2, 
    vertical = false, 
    theme 
}) => css`
    background-color: transparent;
    border-color: ${theme.background[variant]};
    border-style: solid;
    border-width: ${thickness}px;
    height: ${vertical ? "100%" : "0"};
    width: ${vertical ? "0" : "100%"};
`}`;

export default Divider;
export type { DividerProps };