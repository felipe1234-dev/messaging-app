import { Variant } from "@types";
import { spinnerAnimation } from "@styles/animations";
import styled, { css } from "styled-components";

interface ButtonProps {
    variant: Variant;
    fullWidth: boolean;
    uppercase: boolean;
    size: number;
    loading: boolean;
    iconed: boolean;
    noInteraction: boolean;
    transparent: boolean;
    round: boolean;
    selected: boolean;
}

const Button = styled.button<ButtonProps>`${({
    variant,
    fullWidth,
    uppercase,
    size,
    loading,
    iconed,
    noInteraction,
    transparent,
    round,
    selected,
    theme
}) => css`
    position: relative;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    
    width: ${fullWidth ? "100%" : "auto"};
    min-height: 40px;
    cursor: pointer;
    
    outline: 0;
    border: 0;
    margin: 0;
    padding: 6px 16px;
    border-radius: 8px;
    box-sizing: border-box;
    vertical-align: middle;
    text-decoration: none;
    user-select: none;
    box-shadow: none;
    
    font-weight: 500;
    font-size: ${size}em;
    line-height: 1.75;
    letter-spacing: 0.02857em;
    
    color: ${theme.text[variant]};
    ${uppercase && "text-transform: uppercase;"}
    background-color: ${theme.button[variant]};

    transition: 
        background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms
    ;

    * {
        pointer-events: none;
    }

    ${!loading && css`
        ${transparent && "background-color: transparent;"}

        &:hover {
            background-color: ${transparent ? "rgba(255,255,255,0.05)" : theme.hover[variant]};
        }

        ${selected && css`
            background-color: ${transparent ? "rgba(255,255,255,0.05)" : theme.hover[variant]};
        `}
    `}

    &[disabled] {
        cursor: not-allowed;
        background-color: ${theme.button.disabled};
    }

    &::after {
        content: "";
        position: absolute;
        width: 16px;
        height: 16px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border: 4px solid transparent;
        border-top-color: ${theme.hover[variant]};;
        border-radius: 50%;
        animation-name: ${spinnerAnimation};
        animation-duration: 1s;
        animation-timing-function: ease;
        animation-iteration-count: infinite;
        opacity: 0;
    }

    ${loading && css`
        &::after {
            opacity: 1;
        }
    `}

    ${iconed && css`
        min-width: auto;
        min-height: auto;
        width: fit-content;
        height: fit-content;
        padding: 10px;
    `}

    ${noInteraction && css`
        pointer-events: none;
        cursor: default;
    `}

    ${round && css`
        border-radius: 50%;
    `}
`}`;

export { Button as StyledButton };
export type { ButtonProps as StyledButtonProps };