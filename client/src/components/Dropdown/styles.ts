import styled, { css, keyframes } from "styled-components";
import { Variant } from "@types";

const DropdownContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

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

const DropdownContent = styled.div<DropdownContentProps>`
    transition: all 0.5s ease-in;

    ${({ open }) =>
        open
            ? css`
                  height: fit-content;
                  overflow: auto;
                  opacitty: 1;
              `
            : css`
                  height: 0;
                  opacity: 0;
                  overflow: hidden;
              `}
`;

export { DropdownContainer, ButtonContainer, ArrowButton, DropdownContent };
