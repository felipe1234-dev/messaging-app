import styled from "styled-components";

interface StyledAvatarProps {
    backgroundColor?: string;
    size: number;
    multiple: boolean;
}

const StyledAvatar = styled.div<StyledAvatarProps>`
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    ${({ multiple }) => multiple && "gap: 3px;"}

    width: fit-content;
    height: fit-content;
    padding: 10px;

    font-size: ${props => props.size}em;
    line-height: 1;
    border-radius: 50%;

    overflow: hidden;
    user-select: none;

    ${({ backgroundColor }) => backgroundColor && `background-color: ${backgroundColor};`}
    color: #fff;
`;

export { StyledAvatar };