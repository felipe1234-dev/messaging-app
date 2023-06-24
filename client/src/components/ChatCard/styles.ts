import styled, { css } from "styled-components";

const px = 10;
const py = 10;

interface OuterContainerProps {
    selected: boolean;
}

const OuterContainer = styled.div<OuterContainerProps>`
    ${({ selected }) => css`
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: fit-content;
        background-color: transparent;
        transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        cursor: pointer;
        border-radius: 8px;

        &:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }

        ${selected &&
        css`
            background-color: rgba(255, 255, 255, 0.05);
        `}
    `}
`;

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: calc(100% - ${2 * px}px);
    height: fit-content;
    background-color: transparent;
    padding: ${py}px ${px}px;
    gap: 10px;
`;

const CardInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 5px;
    background-color: transparent;
`;

export { OuterContainer, InnerContainer, CardInfo };
