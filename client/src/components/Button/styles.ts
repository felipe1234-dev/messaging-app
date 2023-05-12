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
}

const Button = styled.button<ButtonProps>`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    
    width: ${props => props.fullWidth ? "100%" : "auto"};
    min-height: 40px;
    
    box-sizing: border-box;
    outline: 0;
    border: 0;
    border-radius: 8px;
    margin: 0;
    padding: 6px 16px;
    vertical-align: middle;
    text-decoration: none;
    user-select: none;

    cursor: pointer;
    
    font-weight: 500;
    font-size: ${props => props.size}em;
    line-height: 1.75;
    letter-spacing: 0.02857em;
    box-shadow: none;
    
    color: ${({ variant, theme }) => theme.text[variant]};
    ${props => props.uppercase && "text-transform: uppercase;"}
    background-color: ${({ variant, theme }) => theme.button[variant]};

    transition: 
        background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms
    ;

    * {
        pointer-events: none;
    }

    ${({ loading, variant, transparent, theme }) => !loading && css`
        ${transparent && "background-color: transparent;"}

        &:hover {
            background-color: ${transparent ? "rgba(255,255,255,0.05);" : theme.hover[variant]};
        }
    `}

    &[disabled] {
        cursor: not-allowed;
        background-color: ${({ theme }) => theme.button.disabled};
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
        border-top-color: ${({ variant, theme }) => theme.hover[variant]};;
        border-radius: 50%;
        animation-name: ${spinnerAnimation};
        animation-duration: 1s;
        animation-timing-function: ease;
        animation-iteration-count: infinite;
        opacity: 0;
    }

    ${({ loading }) => loading && css`
        &::after {
            opacity: 1;
        }
    `}

    ${({ iconed }) => iconed && css`
        min-width: auto;
        min-height: auto;
        width: fit-content;
        height: fit-content;
        padding: 10px;
    `}

    ${({ noInteraction }) => noInteraction && css`
        pointer-events: none;
        cursor: default;
    `}

    ${({ round }) => round && css`
        border-radius: 50%;
    `}
`;

export { Button as StyledButton };
export type { ButtonProps as StyledButtonProps };