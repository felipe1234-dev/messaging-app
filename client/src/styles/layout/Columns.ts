import styled from "styled-components";
import { Justify, Align } from "@types";

interface ColumnsProps {
    align?: Align;
    justify?: Justify;
    multiline?: boolean;
    gap?: number;
    ml?: number;
    mr?: number;
    mt?: number;
    mb?: number;
    pt?: number;
    pl?: number;
    pr?: number;
    pb?: number;
}

const Columns = styled.div<ColumnsProps>`
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: ${({ align }) => align && align};
    justify-content: ${({ justify }) => justify};
    gap: ${({ gap }) => gap}px;
    ${({ multiline }) => multiline && "flex-wrap: wrap;"}

    margin-left: ${({ ml }) => ml}px;
    margin-right: ${({ mr }) => mr}px;
    margin-top: ${({ mt }) => mt}px;
    margin-bottom: ${({ mb }) => mb}px;

    padding-top: ${({ pt }) => pt}px;
    padding-left: ${({ pl }) => pl}px;
    padding-right: ${({ pr }) => pr}px;
    padding-bottom: ${({ pb }) => pb}px;
`;

Columns.defaultProps = {
    align: "start",
    justify: "center",
    multiline: true,
    gap: 10,
};

export default Columns;
export type { ColumnsProps };
