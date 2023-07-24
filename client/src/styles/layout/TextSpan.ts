import styled, { css } from "styled-components";
import { Variant, FontStyle } from "@types";

interface TextSpanProps {
    variant?: Variant;
    size?: number;
    fontStyle?: FontStyle;
    fontWeight?: number;
    ml?: number;
    mr?: number;
    mt?: number;
    mb?: number;
    pt?: number;
    pl?: number;
    pr?: number;
    pb?: number;
}

const TextSpan = styled.span<TextSpanProps>`
    ${({
        size,
        variant,
        fontStyle,
        fontWeight,
        ml,
        mr,
        mt,
        mb,
        pl,
        pr,
        pt,
        pb,
        theme,
    }) => css`
        font-size: ${size}em;
        font-style: ${fontStyle};
        font-weight: ${fontWeight};
        ${variant &&
        css`
            color: ${theme.text[variant]};
        `};

        margin-left: ${ml}px;
        margin-right: ${mr}px;
        margin-top: ${mt}px;
        margin-bottom: ${mb}px;

        padding-top: ${pt}px;
        padding-left: ${pl}px;
        padding-right: ${pr}px;
        padding-bottom: ${pb}px;
    `}
`;

TextSpan.defaultProps = {
    size: 1,
    variant: "primary",
    fontStyle: "normal",
    fontWeight: 500,
    ml: 0,
    mr: 0,
    mt: 0,
    mb: 0,
    pt: 0,
    pl: 0,
    pr: 0,
    pb: 0,
};

export default TextSpan;
export type { TextSpanProps };
