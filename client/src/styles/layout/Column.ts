import styled, { css } from "styled-components";

interface ColumnProps {
    size?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
}

const Column = styled.div<ColumnProps>`
  flex: 1;
  padding: 0 10px;
  
  ${({ size }) => size && `flex-basis: ${(size / 12) * 100}%`};

  ${({ theme, xs }) => xs && css`
    @media (min-width: ${theme.breakpoints.xs}px) {
      flex-basis: ${(xs / 12) * 100}%;
    }
  `}

  ${({ theme, sm }) => sm && css`
    @media (min-width: ${theme.breakpoints.sm}px) {
      flex-basis: ${(sm / 12) * 100}%;
    }
  `}

  ${({ theme, md }) => md && css`
    @media (min-width: ${theme.breakpoints.md}px) {
      flex-basis: ${(md / 12) * 100}%;
    }
  `}

  ${({ theme, lg }) => lg && css`
    @media (min-width: ${theme.breakpoints.lg}px) {
      flex-basis: ${(lg / 12) * 100}%;
    }
  `}

  ${({ theme, xl }) => xl && css`
    @media (min-width: ${theme.breakpoints.xl}px) {
      flex-basis: ${(xl / 12) * 100}%;
    }
  `}
`;

export default Column;
export type { ColumnProps };