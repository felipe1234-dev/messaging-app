import styled, { css } from "styled-components";
import { shade } from "@functions";

interface LabelProps {
    disabled: boolean;
}

const Label = styled.label<LabelProps>`${({ disabled, theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
    padding-left: 35px;
    
    min-height: 25px;
    min-width: 25px;
    border-radius: 5px;
    
    cursor: pointer;
    user-select: none;

    &:hover input ~ span {
        background-color: ${shade(theme.checkbox.secondary, 0.2)};
    }

    input[type="checkbox"] {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;

        &:checked ~ span {
            background-color: ${theme.checkbox.primary};

            &:after {
                display: block;
            }
        }

        &[disabled] {
            cursor: default;
        }
    }

    ${disabled && css`
        cursor: default;
        opacity: .5;
    `}
`}`;

const Checkmark = styled.span`${({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: ${theme.checkbox.secondary};
    border-radius: 5px;

    &:after {
        content: "";
        position: absolute;
        display: none;
        left: 9px;
        top: 5px;
        width: 5px;
        height: 10px;
        border: solid #fff;
        border-width: 0 3px 3px 0;
        transform: rotate(45deg);
    }
`}`;

export { Label, Checkmark };