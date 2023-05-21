import styled from "styled-components";
import { Position } from "@types";

const positionToStyle = {
    "top-left": `
        top: 0;
        left: 0;
    `,
    "top-right": `
        top: 0;
        right: 0;
    `,
    "top-center": `
        top: 0;
        left: 50%;
    `,

    "bottom-left": `
        bottom: 0;
        left: 0;
    `,
    "bottom-right": `
        bottom: 0;
        right: 0;
    `,
    "bottom-center": `
        bottom: 0;
        left: 50%;
    `,

    "center": `
        top: 50%;
        left: 50%;
    `,
    "center-right": `
        top: 50%;
        right: 0;
    `,
    "center-left": `
        top: 50%;
        left: 0;
    `
};

const BadgeContainer = styled.div`
    position: relative;
`;

interface StyledBadgeProps {
    position: Position;
}

const StyledBadge = styled.div<StyledBadgeProps>`
    position: absolute;
    ${({ position }) => positionToStyle[position]}
    z-index: 10;
`;

export { BadgeContainer, StyledBadge };
export type { StyledBadgeProps };