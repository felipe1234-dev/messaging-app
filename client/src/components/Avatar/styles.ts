import styled from "styled-components";

interface StyledAvatarProps {
    backgroundColor?: string;
}

const StyledAvatar = styled.div<StyledAvatarProps>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    width: 40px;
    height: 40px;

    font-size: 1.25rem;
    line-height: 1;
    border-radius: 50%;

    overflow: hidden;
    user-select: none;

    ${({ backgroundColor }) => backgroundColor && `background-color: ${backgroundColor};`}
`;

export { StyledAvatar };