import styled, { css } from "styled-components";
import { Variant } from "@types";

interface ArrowButtonProps {
    open: boolean;
    iconVariant: Variant;
}

const ArrowButton = styled.div<ArrowButtonProps>`
    ${({ open, iconVariant, theme }) => css`
        display: flex;
        padding: 0;

        cursor: pointer;
        background-color: transparent;

        border: none;
        border-radius: 10px;

        transition: all 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

        transform: rotate(0deg);

        ${open &&
        css`
            transform: rotate(90deg);
        `}

        &:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }

        svg {
            color: ${theme.icon[iconVariant]};
        }
    `}
`;

export { ArrowButton };
