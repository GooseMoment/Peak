import styled from "styled-components"
import FilterButton from "@components/search/FilterButton"

const FilterGroup = ({ filters }) => {
    return <FilterGroupWrapper>
        {Object.entries(filters).map(([name, filter]) => (
            <FilterButton key={name} filter={filter} />
        ))}
    </FilterGroupWrapper>
}

const FilterGroupWrapper = styled.div`
    margin: 1em 0 1em;

    border: solid white 1px;

    display: flex;
    gap: 0.5em;
`

export default FilterGroup