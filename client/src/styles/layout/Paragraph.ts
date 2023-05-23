import styled, { css } from "styled-components";
import { Variant } from "@types";

interface ParagraphProps {
    variant?: Variant; 
    size?: number;
    ml?: number;
    mr?: number;
    mt?: number;
    mb?: number;
    pt?: number;
    pl?: number;
    pr?: number;
    pb?: number;
}

const Paragraph = styled.p<ParagraphProps>`${({
    size,
    variant,
    ml, mr,
    mt, mb,
    pl, pr,
    pt, pb,
    theme
}) => css`
    font-size: ${size}em;
    ${variant && css`color: ${theme.text[variant]}`};

    margin-left: ${ml}px;
    margin-right: ${mr}px;
    margin-top: ${mt}px;
    margin-bottom: ${mb}px;

    padding-top: ${pt}px;
    padding-left: ${pl}px;
    padding-right: ${pr}px;
    padding-bottom: ${pb}px;
`}`;

Paragraph.defaultProps = {
    size: 1,
    variant: "primary",
    ml: 0,
    mr: 0,
    mt: 0,
    mb: 0,
    pt: 0,
    pl: 0,
    pr: 0,
    pb: 0
};

export default Paragraph;
export type { ParagraphProps };