import styled from "styled-components";
import { Variant } from "@types";

export interface StyledLinkProps {
    variant: Variant;
    size: number;
}

export const StyledLink = styled.a<StyledLinkProps>`
    color: ${({ variant, theme }) => theme.link[variant]};
    font-size: ${({ size }) => size}em;
    text-decoration: none;
    cursor: pointer;

    &:hover {
        text-decoration-line: underline;
        text-decoration-color: ${({ variant, theme }) => theme.link[variant]};
        opacity: 0.8;
    }
`;

