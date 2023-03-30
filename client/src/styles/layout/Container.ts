import styled from "styled-components";
import { Variant } from "@types";

interface ContainerProps {
    direction?: "row" | "column";
    align?: "start" | "end" | "center";
    justify?: "center" | "start" | "end" | "spcae-between" | "space-around" | "space-evenly";
    gap?: number;
    width?: string;
    height?: string;
    transparent?: boolean;
    variant?: Variant;
    borderRadius?: string;
    mt?: number;
    ml?: number;
    mr?: number;
    mb?: number;
    pt?: number;
    pl?: number;
    pr?: number;
    pb?: number;
}

const Container = styled.div<ContainerProps>`
    display: flex;
    flex-direction: ${({ direction }) => direction};
    align-items: ${({ align }) => align};
    justify-content: ${({ justify }) => justify};
    gap: ${({ gap }) => gap}px;

    width: ${({ width }) => width};
    height: ${({ height }) => height};

    margin-top: ${({ mt }) => mt}px;
    margin-left: ${({ ml }) => ml}px;
    margin-right: ${({ mr }) => mr}px;
    margin-bottom: ${({ mb }) => mb}px;

    padding-top: ${({ pt }) => pt}px;
    padding-left: ${({ pl }) => pl}px;
    padding-right: ${({ pr }) => pr}px;
    padding-bottom: ${({ pb }) => pb}px;

    ${({ transparent }) => transparent && "background-color: transparent;"}
    ${({ variant, theme }) => variant && `background-color: ${theme.background[variant]};`}
    ${({ borderRadius }) => borderRadius && `border-radius: ${borderRadius};`}
`;

Container.defaultProps = {
    direction: "column",
    align: "center",
    justify: "center",
    gap: 15,
    width: "100%",
    height: "100%",
    transparent: true,
    borderRadius: "0",
    mt: 0,
    ml: 0,
    mr: 0,
    mb: 0,
    pt: 0,
    pl: 0,
    pr: 0,
    pb: 0
};

export default Container;
export type { ContainerProps };