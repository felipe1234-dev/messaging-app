import styled from "styled-components";

interface RowsProps {
    align?: "center" | "start" | "end";
    justify?: "center" | "space-between" | "space-around" | "start" | "end";
    multiline?: boolean;
    gap?: number;
}

const Rows = styled.div<RowsProps>`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: ${({ align }) => align && align};
    justify-content: ${({ justify }) => justify && justify};
    gap: ${({ gap }) => gap}px;
    ${({ multiline }) => multiline && "flex-wrap: wrap;"}
`;

Rows.defaultProps = {
    align: "start",
    justify: "center",
    multiline: true,
    gap: 10,
};

export default Rows;
export type { RowsProps };
