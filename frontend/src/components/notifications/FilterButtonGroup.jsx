import MildButton from "@components/common/MildButton"

import styled from "styled-components"

const FilterButtonGroup = ({active, setActive, filters}) => {

    return <FilterGroup>
        {Object.entries(filters).map(([name, filter]) => 
            <FilterButton key={name} onClick={e => setActive(name)} $active={active === name}>{filter.display}</FilterButton>)
        }
    </FilterGroup>
}

const FilterGroup = styled.div`
display: inline-flex;
justify-content: space-between;
gap: 0.25em;

background-color: #F3F3F3;
border-radius: 60px;
padding: 0.3em;
`

const FilterButton = styled(MildButton)`
flex: 1 1 auto;

font-size: 0.9rem;
font-weight: 500;
border-radius: 50px;
padding: 0.5rem 0.75rem;

background-color: ${props => props.$active ? "white" : "inherit"};
filter: ${props => props.$active ? "drop-shadow(2px 2px 3px #00000041)" : "none"};

cursor: pointer;
`

export default FilterButtonGroup