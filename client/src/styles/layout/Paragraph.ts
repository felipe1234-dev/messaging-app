import styled from "styled-components";
import { Variant } from "@types";

interface ParagraphProps {
    variant?: Variant; 
    size?: number;
}

const Paragraph = styled.p<ParagraphProps>`
    font-size: ${({ size }) => size}em;
    color: ${({ variant, theme }) => variant && theme.text[variant]};
`;

Paragraph.defaultProps = {
    size: 1,
    variant: "primary"
};

export default Paragraph;
export type { ParagraphProps };