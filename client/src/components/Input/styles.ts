import styled, { css } from "styled-components";
import { Variant } from "@types";

const backgroundColor = "rgba(255, 255, 255, 0.09)";
const lightBackgroundColor = "rgba(255, 255, 255, 0.3)"
const autoFillColor = "rgb(70, 70, 70)";

interface InputContainerProps {
    variant: Variant;
    fullWidth: boolean;
}

const InputContainer = styled.div<InputContainerProps>`
    width: ${props => props.fullWidth ? "100%" : "auto"};
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.4375em;
    letter-spacing: 0.00938em;
    color: ${({ variant, theme }) => theme.text[variant]};
    box-sizing: border-box;
    cursor: text;
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    position: relative;
    background-color: ${backgroundColor};
    border-radius: 8px;
    transition: background-color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    padding: 12px;

    &:has(input:focus), &:has(input:hover), &:hover {
        background-color: ${lightBackgroundColor};

        input {
            background-color: transparent !important;
        }
    }
`;

interface InputProps {
    variant: Variant;
    leftIcon: boolean;
    rightIcon: boolean;
}

const Input = styled.input<InputProps>`
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    color: ${({ variant, theme }) => theme.text[variant]};
    font-size: 1em;

    ${({ leftIcon }) => leftIcon && "padding-left: 10px;"}
    ${({ rightIcon }) => rightIcon && "padding-right: 10px;"}

    &:-internal-autofill-selected {
        -webkit-box-shadow: 0 0 0 1000px ${autoFillColor} inset;
        box-shadow: 0 0 0 1000px ${autoFillColor} inset;
        -webkit-text-fill-color: ${({ variant, theme }) => theme.text[variant]};

        &:hover,
        &:focus,
        &:active {
            -webkit-box-shadow: 0 0 0 1000px ${autoFillColor} inset;
            box-shadow: 0 0 0 1000px ${autoFillColor} inset;
            -webkit-text-fill-color: ${({ variant, theme }) => theme.text[variant]};
        }
    }

    &:focus {
        outline: none;
    }

    &[disabled] {
        cursor: not-allowed;
    }
`;

interface IconButtonProps {
}

const IconButton = styled.button<IconButtonProps>`
    cursor: pointer;
    background-color: transparent;
    display: flex;
    padding: 0;
    border: none;
    border-radius: 10px;
    transition: background-color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
`;

export { Input as StyledInput, InputContainer, IconButton };