import styled, { css } from "styled-components";
import { Variant } from "@types";
import { shade } from "@functions";

interface StyledLinkProps {
    variant: Variant;
    size: number;
}

const StyledLink = styled.a<StyledLinkProps>`
    ${({ variant, theme, size }) => css`
        color: ${theme.link[variant]};
        font-size: ${size}em;
        text-decoration: none;
        cursor: pointer;

        &:hover {
            text-decoration-line: underline;
            text-decoration-color: ${shade(theme.link[variant], 0.2)};
            opacity: 0.8;
        }
    `}
`;

export { StyledLink };
export type { StyledLinkProps };
