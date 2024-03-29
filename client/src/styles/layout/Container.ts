import styled, { css } from "styled-components";
import { Variant, Direction, Align, Justify } from "@types";
import { shade } from "@functions";

interface ContainerProps {
    direction?: Direction;
    align?: Align;
    justify?: Justify;
    gap?: number;
    flex?: string;

    width?: string;
    height?: string;

    transparent?: boolean;
    transparency?: number;
    variant?: Variant;

    light?: number;

    mt?: number;
    ml?: number;
    mr?: number;
    mb?: number;
    mx?: number;
    my?: number;
    m?: number;

    pt?: number;
    pl?: number;
    pr?: number;
    pb?: number;
    px?: number;
    py?: number;
    p?: number;

    roundedTL?: string;
    roundedTR?: string;
    roundedBL?: string;
    roundedBR?: string;
    rounded?: string;

    overflowX?: string;
    overflowY?: string;
}

const Container = styled.div<ContainerProps>`
    ${({
        direction,
        align,
        justify,
        gap,
        flex,

        width,
        height,

        light,

        mt,
        mb,
        ml,
        mr,
        mx,
        my,
        m,

        pt,
        pb,
        pl,
        pr,
        px,
        py,
        p,

        roundedTL,
        roundedTR,
        roundedBL,
        roundedBR,
        rounded,

        variant,
        transparent,
        transparency,

        overflowX,
        overflowY,

        theme,
    }) => css`
        display: flex;
        flex-direction: ${direction};
        align-items: ${align};
        justify-content: ${justify};
        gap: ${gap}px;
        ${flex &&
        css`
            flex: ${flex};
        `}

        width: ${width};
        height: ${height};
        background-color: ${transparent || !variant
            ? `rgba(255, 255, 255, ${light})`
            : shade(theme.background[variant], light || 0)};

        opacity: ${1 - (transparency || 0)};

        ${overflowX &&
        css`
            overflow-x: ${overflowX};
        `}
        ${overflowY &&
        css`
            overflow-y: ${overflowY};
        `}

        ${p
            ? css`
                  padding: ${p}px;
              `
            : css`
                  padding-top: ${py ?? pt}px;
                  padding-left: ${px ?? pl}px;
                  padding-right: ${px ?? pr}px;
                  padding-bottom: ${py ?? pb}px;
              `}

        ${m
            ? css`
                  margin: ${m}px;
              `
            : css`
                  margin-top: ${my ?? mt}px;
                  margin-left: ${mx ?? ml}px;
                  margin-right: ${mx ?? mr}px;
                  margin-bottom: ${my ?? mb}px;
              `}

        ${rounded
            ? css`
                  border-radius: ${rounded};
              `
            : css`
                  border-top-left-radius: ${roundedTL};
                  border-top-right-radius: ${roundedTR};
                  border-bottom-left-radius: ${roundedBL};
                  border-bottom-right-radius: ${roundedBR};
              `}
    `}
`;

Container.defaultProps = {
    variant: "primary",
    direction: "column",
    align: "center",
    justify: "center",
    gap: 15,
    width: "100%",
    height: "100%",
    transparent: false,
    transparency: 0,
    light: 0,
    pl: 0,
    pr: 0,
    pb: 0,
    pt: 0,
    ml: 0,
    mr: 0,
    mt: 0,
    mb: 0,
    roundedTL: "0",
    roundedTR: "0",
    roundedBL: "0",
    roundedBR: "0",
};

export default Container;
export type { ContainerProps };
