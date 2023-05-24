import styled, { css, keyframes } from "styled-components";
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

interface DropdownContentProps {
    open: boolean;
}

const dropdownOpeningAnimation = keyframes`
    from {
        height: 0;
        opacity: 0;
    }

    to {
        height: fit-content;
        opacity: 1;
    }
`;

const DropdownContent = styled.div<DropdownContentProps>`
    ${({ open }) =>
        open
            ? css`
                  animation-name: ${dropdownOpeningAnimation};
                  animation-duration: 200ms;
              `
            : css`
                  height: 0;
                  opacity: 0;
                  overflow: hidden;
              `}
`;

export { ArrowButton, DropdownContent };
export type { ArrowButtonProps, DropdownContentProps };
