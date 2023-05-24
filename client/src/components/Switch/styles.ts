import styled, { css } from "styled-components";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
`;

const Label = styled.label`
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;

    input {
        opacity: 0;
        width: 0;
        height: 0;

        &:checked + span {
            background-color: ${({ theme }) => theme.checkbox.primary};

            & > * {
                transform: translateX(26px);
            }
        }

        &:checked + span:before {
            transform: translateX(26px);
        }

        &:focus + span {
            box-shadow: 0 0 1px ${({ theme }) => theme.checkbox.primary};
        }
    }
`;

interface SliderProps {
    round: boolean;
}

const Slider = styled.span<SliderProps>`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;

    display: flex;
    align-items: center;
    justify-content: flex-start;

    background-color: ${({ theme }) => theme.checkbox.secondary};

    &,
    > * {
        transition: 0.4s;
    }

    > * {
        position: relative;
        z-index: 2;
    }

    &:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: ${({ theme }) => theme.text.primary};
        transition: 0.4s;
    }

    ${({ round }) =>
        round &&
        css`
            border-radius: 34px;

            &:before {
                border-radius: 50%;
            }
        `}
`;

export { Wrapper, Label, Slider };
export type { SliderProps };
