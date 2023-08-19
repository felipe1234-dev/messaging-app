import styled, { css } from "styled-components";
import { Variant } from "@types";

const time = "500ms";

interface DarkBackgroundProps {
    visible: boolean;
}

const DarkBackground = styled.div<DarkBackgroundProps>`
    ${({ visible }) => css`
        width: 100%;
        height: 100vh;

        display: flex;
        align-items: center;
        justify-content: center;

        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;

        opacity: 0.8;
        transition: opacity ease-in-out ${time};

        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);

        ${!visible &&
        css`
            display: none;
        `}
    `}
`;

interface ModalContainerProps {
    variant: Variant;
    textVariant: Variant;
}

const ModalContainer = styled.div<ModalContainerProps>`
    ${({ variant, textVariant, theme }) => css`
        background-color: ${theme.background[variant]};
        color: ${theme.text[textVariant]};

        transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        border-radius: 4px;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 11px 15px -7px,
            rgba(0, 0, 0, 0.14) 0px 24px 38px 3px,
            rgba(0, 0, 0, 0.12) 0px 9px 46px 8px;
        margin: 32px;
        position: relative;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        max-height: calc(100vh - 64px);
        max-width: 600px;
        opacity: 0.8;
        transition: opacity ease-in-out ${time};

        &:hover {
            opacity: 1;
        }
    `}
`;

const ModalHeaderAndFooterStyles = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    flex-wrap: wrap;

    padding: 16px 24px;
    margin: 0px;
    flex: 0 0 auto;
`;

const ModalHeader = styled.header`
    ${ModalHeaderAndFooterStyles}
`;

const ModalBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 5px;
    padding: 16px 24px;
    margin: 0px;
`;

const ModalFooter = styled.footer`
    ${ModalHeaderAndFooterStyles}
`;

export { DarkBackground, ModalContainer, ModalHeader, ModalBody, ModalFooter };
