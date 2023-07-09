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

const Info = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
`;

const Actions = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;
`;

export { Card, Info, Actions };
