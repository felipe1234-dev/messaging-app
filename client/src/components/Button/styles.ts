import styled, { css } from "styled-components";
import { spinnerAnimation } from "@styles/animations";
import { Variant, Align, Justify, Direction } from "@types";
import { shade } from "@functions";

interface ButtonProps {
    variant: Variant;
    direction: Direction;
    justify: Justify;
    align: Align;
    gap: number;
    width: string;
    height: string;
    textVariant: Variant;
    iconVariant: Variant;
    fullWidth: boolean;
    uppercase: boolean;
    size: number;
    pt?: number;
    pl?: number;
    pr?: number;
    pb?: number;
    px?: number;
    py?: number;
    p?: number;
    borderRadius: number;
    hoverDisabled: boolean;
    loading: boolean;
    iconed: boolean;
    noInteraction: boolean;
    transparent: boolean;
    round: boolean;
    selected: boolean;
}

const Button = styled.button<ButtonProps>`
    ${({
        variant,
        textVariant,
        iconVariant,
        direction,
        justify,
        align,
        gap,
        width,
        height,
        fullWidth,
        uppercase,
        size,
        pt,
        pb,
        pl,
        pr,
        px,
        py,
        p,
        borderRadius,
        hoverDisabled,
        loading,
        iconed,
        noInteraction,
        transparent,
        round,
        selected,
        theme,
    }) => css`
        position: relative;

        display: inline-flex;
        flex-direction: ${direction};
        align-items: ${align};
        justify-content: ${justify};
        gap: ${gap}px;

        width: ${fullWidth ? "100%" : width};
        height: ${height};
        min-height: 40px;
        cursor: pointer;

        outline: 0;
        border: 0;
        margin: 0;

        ${p
            ? css`
                  padding: ${p}px;
              `
            : css`
                  padding-top: ${py ?? pt}px;
                  padding-left: ${px ?? pl}px;
                  padding-right: ${px ?? pr}px;
                  padding-bottom: ${py ?? pb}px;
              `}

        border-radius: ${borderRadius}px;
        box-sizing: border-box;
        vertical-align: middle;
        text-decoration: none;
        user-select: none;
        box-shadow: none;

        font-weight: 500;
        font-size: ${size}em;
        line-height: 1.75;
        letter-spacing: 0.02857em;

        color: ${theme.text[textVariant]};
        ${uppercase &&
        css`
            text-transform: uppercase;
        `}

        ${selected
            ? css`
                  background-color: ${transparent
                      ? "rgba(255, 255, 255, 0.05)"
                      : shade(theme.button[variant], 0.2)};
              `
            : transparent
            ? css`
                  background-color: transparent;
              `
            : css`
                  background-color: ${theme.button[variant]};
              `}

        ${!hoverDisabled &&
        css`
            &:hover {
                background-color: ${transparent
                    ? "rgba(255, 255, 255, 0.05)"
                    : shade(theme.button[variant], 0.2)};
            }
        `}

            transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
            box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
            border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
            color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

        * {
            pointer-events: none;
        }

        &[disabled] {
            cursor: not-allowed;
            opacity: 0.5;
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
            border-color: ${shade(
                theme.button[iconed ? iconVariant : variant],
                0.1
            )};
            border-top-color: ${shade(
                theme.button[iconed ? iconVariant : variant],
                0.2
            )};
            border-radius: 50%;
            animation-name: ${spinnerAnimation};
            animation-duration: 1s;
            animation-timing-function: ease;
            animation-iteration-count: infinite;
            opacity: 0;
        }

        ${loading &&
        css`
            &::after {
                opacity: 1;
            }
        `}

        ${iconed &&
        css`
            min-width: auto;
            min-height: auto;
            width: fit-content;
            height: fit-content;

            svg {
                color: ${theme.icon[iconVariant]};
            }
        `}

    ${noInteraction &&
        css`
            pointer-events: none;
            cursor: default;
        `}

    ${round &&
        css`
            border-radius: 50%;
        `}
    `}
`;

export { Button as StyledButton };
export type { ButtonProps as StyledButtonProps };
