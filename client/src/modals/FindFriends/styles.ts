import styled from "styled-components";

const OuterContainer = styled.div`
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    min-width: 560px;
`;

const SearchInputContainer = styled.div`
    background-color: transparent;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: 100%;
`;

const SearchResultsContainer = styled.div`
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
    width: 100%;
    height: 300px;
    padding: 30px 0;
`;

export { OuterContainer, SearchInputContainer, SearchResultsContainer };
