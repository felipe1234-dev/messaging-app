import styled from "styled-components";

interface ContainerProps {
    direction?: "row" | "column";
    align?: "start" | "end" | "center";
    justify?: "center" | "start" | "end" | "spcae-between" | "space-around" | "space-evenly";
    gap?: number;
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
    width: 100%;
    height: 100%;
    margin-top: ${({ mt }) => mt}px;
    margin-left: ${({ ml }) => ml}px;
    margin-right: ${({ mr }) => mr}px;
    margin-bottom: ${({ mb }) => mb}px;
    padding-top: ${({ pt }) => pt}px;
    padding-left: ${({ pl }) => pl}px;
    padding-right: ${({ pr }) => pr}px;
    padding-bottom: ${({ pb }) => pb}px;
`;

Container.defaultProps = {
    direction: "column",
    align: "center",
    justify: "center",
    gap: 15,
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