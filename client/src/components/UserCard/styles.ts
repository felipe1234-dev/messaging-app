import styled, { css } from "styled-components";
import { showItemAnimation } from "@styles/animations";

const Card = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    animation: ${showItemAnimation};
`;

const Main = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
`;

const Actions = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;
`;

export { Card, Main, Info, Actions };
