import styled from "styled-components"

interface ColumnsProps {
    align?: "center" | "start" | "end";
    justify?: "center" | "space-between" | "space-around" | "start" | "end";
    multiline?: boolean;
    gap?: number;
}

const Columns = styled.div<ColumnsProps>`
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: ${({ align }) => align && align};
    justify-content: ${({ justify }) => justify};
    gap: ${({ gap }) => gap}px;
    ${({ multiline }) => multiline && "flex-wrap: wrap;"}
`;

Columns.defaultProps = {
    align: "start",
    justify: "center",
    multiline: true,
    gap: 10
};

export default Columns;
export type { ColumnsProps };