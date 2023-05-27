import styled, { css } from "styled-components";
import { Variant } from "@types";
import { shade } from "@functions";

interface InputContainerProps {
    variant: Variant;
    textVariant: Variant;
    fullWidth: boolean;
    disableHover: boolean;
    light: number;
}

const InputContainer = styled.div<InputContainerProps>`
    ${({ variant, textVariant, fullWidth, disableHover, light, theme }) => css`
        position: relative;
        display: inline-flex;
        align-items: center;
        background-color: ${shade(theme.background[variant], light)};
        color: ${theme.text[textVariant]};

        cursor: text;
        width: ${fullWidth ? "100%" : "auto"};
        border-radius: 8px;
        padding: 12px;

        font-weight: 400;
        font-size: 1rem;
        line-height: 1.4375em;
        letter-spacing: 0.00938em;
        box-sizing: border-box;

        -webkit-box-align: center;
        transition: background-color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

        input:-internal-autofill-selected {
            -webkit-box-shadow: 0 0 0 1000px ${theme.background[variant]} inset;
            box-shadow: 0 0 0 1000px ${theme.background[variant]} inset;
            -webkit-text-fill-color: ${theme.text[textVariant]};
            transition: all 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
        }

        ${!disableHover &&
        css`
            &:has(input:focus),
            &:has(input:hover),
            &:hover {
                background-color: ${shade(theme.background[variant], 0.2)};
                color: ${shade(theme.text[textVariant], 0.2)};

                input {
                    background-color: transparent !important;

                    &:-internal-autofill-selected {
                        -webkit-box-shadow: 0 0 0 1000px
                            ${shade(theme.background[variant], 0.2)} inset;
                        box-shadow: 0 0 0 1000px
                            ${shade(theme.background[variant], 0.2)} inset;
                        -webkit-text-fill-color: ${shade(
                            theme.text[textVariant],
                            0.2
                        )};
                    }
                }
            }
        `}

        svg {
            width: 1.6em;
        }
    `}
`;

interface StyledInputProps {
    variant: Variant;
    textVariant: Variant;
    leftIcon: boolean;
    rightIcon: boolean;
}

const StyledInput = styled.input<StyledInputProps>`
    ${({ textVariant, leftIcon, rightIcon, theme }) => css`
        width: 100%;
        height: 100%;
        background-color: transparent;
        border: none;
        color: ${theme.text[textVariant]};
        font-size: 1em;

        ${leftIcon &&
        css`
            padding-left: 10px;
        `}
        ${rightIcon &&
        css`
            padding-right: 10px;
        `}

        &:focus {
            outline: none;
        }

        &[disabled] {
            cursor: not-allowed;
        }
    `}
`;

interface IconButtonProps {
    iconVariant: Variant;
}

const IconButton = styled.button<IconButtonProps>`
    ${({ iconVariant, theme }) => css`
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

        svg {
            width: 1.6em;
            color: ${theme.icon[iconVariant]};
        }
    `}
`;

export { StyledInput, InputContainer, IconButton };
