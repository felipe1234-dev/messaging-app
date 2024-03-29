import styled, { css } from "styled-components";
import { shade } from "@functions";

const Form = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 15px;
`;

const CoverImageContainer = styled.figure`
    ${({ theme }) => css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: ${shade(theme.background.secondary, 0.1)};
        border-radius: 5px;

        &,
        img {
            width: 350px;
            height: 300px;
        }
    `}
`;

const CoverImageOverlay = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;

const Actions = styled.footer`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 6px;
    width: 100%;
    height: auto;
    margin-top: 15px;
`;

export { Form, CoverImageContainer, CoverImageOverlay, Actions };
