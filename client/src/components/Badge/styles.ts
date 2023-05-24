import styled, { css } from "styled-components";
import { Position } from "@types";

const positionToStyle = ({
    position,
    mt,
    mb,
    ml,
    mr,
}: {
    position: Position;
    mt: number;
    mb: number;
    ml: number;
    mr: number;
}) => {
    const styles = {
        "top-left": `
            top: ${mt}px;
            left: ${ml}px;
        `,
        "top-right": `
            top: ${mt}px;
            right: ${mr}px;
        `,
        "top-center": `
            top: ${mt}px;
            left: calc(50% + ${ml}px);
        `,

        "bottom-left": `
            bottom: ${mb}px;
            left: ${ml}px;
        `,
        "bottom-right": `
            bottom: ${mb}px;
            right: ${mr}px;
        `,
        "bottom-center": `
            bottom: ${mb}px;
            left: calc(50% + ${ml}px);
        `,

        center: `
            top: calc(50% + ${mt}px);
            left: calc(50% + ${ml}px);
        `,
        "center-right": `
            top: calc(50% + ${mt}px);
            right: ${mr}px;
        `,
        "center-left": `
            top: calc(50% + ${mt}px);
            left: ${ml}px;
        `,
    };

    return css`
        ${styles[position]}
    `;
};

const BadgeContainer = styled.div`
    position: relative;
`;

interface StyledBadgeProps {
    position: Position;
    ml: number;
    mr: number;
    mt: number;
    mb: number;
}

const StyledBadge = styled.div<StyledBadgeProps>`
    ${({ position, ml, mr, mt, mb }) => css`
        position: absolute;
        ${positionToStyle({
            position,
            mt,
            mb,
            ml,
            mr,
        })}
        z-index: 10;
    `}
`;

export { BadgeContainer, StyledBadge };
export type { StyledBadgeProps };
