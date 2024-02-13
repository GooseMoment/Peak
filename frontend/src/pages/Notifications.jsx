import styled from "styled-components"

const Notifications = () => {
    return <>
    <PageTitle>Notifications</PageTitle>
    <FilterGroup>
        <FilterButton>All</FilterButton>
        <FilterButton>Tasks</FilterButton>
        <FilterButton $active>Reactions</FilterButton>
        <FilterButton>Follow</FilterButton>
    </FilterGroup>
    </>
}

const PageTitle = styled.h1`
font-size: 2em;
font-weight: bold;
margin-bottom: 0.5em;
`

const FilterGroup = styled.div`
display: inline-flex;
justify-content: space-between;
gap: 0.25em;

background-color: #F3F3F3;
border-radius: 60px;
padding: 0.5em;
`

const FilterButton = styled.button`
flex: 1 1 auto;

color: inherit;
border: none;
font: inherit;
outline: inherit;

font-size: 0.9rem;
font-weight: 500;
border-radius: 50px;
padding: 0.5rem 0.75rem;

background-color: ${props => props.$active ? "white" : "inherit"};
filter: ${props => props.$active ? "drop-shadow(2px 2px 3px #00000041)" : "none"};
`

export default Notifications