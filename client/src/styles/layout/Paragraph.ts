import styled from "styled-components";
import { Variant } from "@types";

interface ParagraphProps {
    variant?: Variant; 
    size?: number;
    ml?: number;
    mr?: number;
    mt?: number;
    mb?: number;
}

const Paragraph = styled.p<ParagraphProps>`
    font-size: ${({ size }) => size}em;
    color: ${({ variant, theme }) => variant && theme.text[variant]};

    margin-left: ${({ ml }) => ml}px;
    margin-right: ${({ mr }) => mr}px;
    margin-top: ${({ mt }) => mt}px;
    margin-bottom: ${({ mb }) => mb}px;
`;

Paragraph.defaultProps = {
    size: 1,
    variant: "primary",
    ml: 0,
    mr: 0,
    mt: 0,
    mb: 0
};

export default Paragraph;
export type { ParagraphProps };