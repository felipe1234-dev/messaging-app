import styled from "styled-components";

const padding = "10px";

const StyledNav = styled.nav`
    position: relative;
    top: 0;
    width: calc(100% - 2*${padding});
    padding: ${padding};
    overflow: hidden;
    background-color: ${({ theme }) => theme.background.primary};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`;

export { StyledNav };