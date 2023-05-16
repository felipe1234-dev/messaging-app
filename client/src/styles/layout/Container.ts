import styled, { css } from "styled-components";
import { Variant } from "@types";

interface ContainerProps {
    direction?: "row" | "column";
    align?: "start" | "end" | "center";
    justify?: "center" | "start" | "end" | "space-between" | "space-around" | "space-evenly";
    gap?: number;

    width?: string;
    height?: string;

    transparent?: boolean;
    variant?: Variant;

    mt?: number;
    ml?: number;
    mr?: number;
    mb?: number;
    m?: number;

    pt?: number;
    pl?: number;
    pr?: number;
    pb?: number;
    p?: number;

    roundedTL?: string;
    roundedTR?: string;
    roundedBL?: string;
    roundedBR?: string;
    rounded?: string;
}

const Container = styled.div<ContainerProps>`${({
    direction,
    align,
    justify,
    gap,

    width,
    height,

    mt, mb,
    ml, mr,
    m,

    pt, pb,
    pl, pr,
    p,

    roundedTL,
    roundedTR,
    roundedBL,
    roundedBR,
    rounded,

    variant,
    transparent,
    theme
}) => css`
    display: flex;
    flex-direction: ${direction};
    align-items: ${align};
    justify-content: ${justify};
    gap: ${gap}px;

    width: ${width};
    height: ${height};
    background-color: ${transparent || !variant ? "transparent" : theme.background[variant]};
    
    ${p ? css`padding: ${p}px;` : css`
        padding-top: ${pt}px;
        padding-left: ${pl}px;
        padding-right: ${pr}px;
        padding-bottom: ${pb}px;
    `}

    ${m ? css`margin: ${m}px;` : css`
        margin-top: ${mt}px;
        margin-left: ${ml}px;
        margin-right: ${mr}px;
        margin-bottom: ${mb}px;
    `}

    ${rounded ? css`border-radius: ${rounded};` : css`
        border-top-left-radius: ${roundedTL};
        border-top-right-radius: ${roundedTR};
        border-bottom-left-radius: ${roundedBL};
        border-bottom-right-radius: ${roundedBR};
    `}
`}`;

Container.defaultProps = {
    variant: "primary",
    direction: "column",
    align: "center",
    justify: "center",
    gap: 15,
    width: "100%",
    height: "100%",
    transparent: false,
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
    roundedBR: "0"
};

export default Container;
export type { ContainerProps };