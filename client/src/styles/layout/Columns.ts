import styled, { css } from "styled-components";
import { Variant, Justify, Align } from "@types";

interface ColumnsProps {
    variant?: Variant;
    transparent?: boolean;
    align?: Align;
    justify?: Justify;
    multiline?: boolean;
    gap?: number;
    ml?: number;
    mr?: number;
    mt?: number;
    mb?: number;
    m?: number;
    pt?: number;
    pl?: number;
    pr?: number;
    pb?: number;
    p?: number;
    width?: string;
    height?: string;
}

const Columns = styled.div<ColumnsProps>`
    ${({
        transparent,
        variant,

        align,
        justify,
        gap,
        multiline,

        ml,
        mr,
        mt,
        mb,
        m,

        pl,
        pr,
        pt,
        pb,
        p,

        width,
        height,

        theme
    }) => css`
        display: flex;
        flex-direction: row;
        align-items: ${align};
        justify-content: ${justify};
        gap: ${gap}px;
        ${multiline && css`flex-wrap: wrap;`}
        ${variant && css`background-color: ${theme.background[variant]};`}
        ${(transparent && !variant) && css`background-color: transparent;`}

        width: ${width};
        height: ${height};

        ${m
            ? css`
                  margin: ${m}px;
              `
            : css`
                  margin-left: ${ml}px;
                  margin-right: ${mr}px;
                  margin-top: ${mt}px;
                  margin-bottom: ${mb}px;
              `}

        ${p
            ? css`
                  padding: ${p}px;
              `
            : css`
                  padding-top: ${pt}px;
                  padding-left: ${pl}px;
                  padding-right: ${pr}px;
                  padding-bottom: ${pb}px;
              `}
    `}
`;

Columns.defaultProps = {
    transparent: true,

    align: "start",
    justify: "center",
    multiline: true,
    gap: 10,

    ml: 0,
    mr: 0,
    mt: 0,
    mb: 0,

    pl: 0,
    pr: 0,
    pt: 0,
    pb: 0,

    width: "100%",
    height: "fit-content",
};

export default Columns;
export type { ColumnsProps };
