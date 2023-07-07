import styled, { css } from "styled-components";
import { Variant } from "@types";

interface StyledAvatarProps {
    backgroundColor?: string;
    size: number;
    multiple: boolean;
    borderVariant: Variant;
    borderWidth: number;
    borderOffset: number;
    borderStyle: string;
}

const StyledAvatar = styled.div<StyledAvatarProps>`
    ${({
        multiple,
        size,

        backgroundColor,
        borderVariant,
        borderWidth,
        borderOffset,
        borderStyle,

        theme,
    }) => css`
        position: relative;

        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        ${multiple &&
        css`
            gap: 3px;
        `}

        width: fit-content;
        height: fit-content;
        padding: 15px;

        font-size: ${size}em;
        line-height: 1;
        border-radius: 50%;

        overflow: hidden;
        user-select: none;

        ${backgroundColor &&
        css`
            background-color: ${backgroundColor};
        `}
        color: #fff;

        border: none;
        outline-style: ${borderStyle};
        outline-width: ${borderWidth}px;
        outline-color: ${theme.background[borderVariant]};
        outline-offset: ${borderOffset}px;
    `}
`;

export { StyledAvatar };
