import { useState } from "react"

import styled from "styled-components"

import FilterButton from "@components/search/FilterButton"

const FilterGroup = ({ filters, setFilters }) => {
    const [inputState, setInputState] = useState(false)

    const updateFilterValue = (filterName) => (filterValue) => {
        console.log(filterValue)
        setFilters((prev) => ({
            ...prev,
            [filterName]: {
                ...prev[filterName],
                value: filterValue ? filterValue : null,
            },
        }))
    }

    return (
        <FilterGroupWrapper>
            {Object.entries(filters).map(([type, filter]) => (
                <FilterButton
                    key={type}
                    filter={filter}
                    updateFilterValue={updateFilterValue(type)}
                    inputState={inputState}
                    setInputState={setInputState}
                />
            ))}
        </FilterGroupWrapper>
    )
}

const FilterGroupWrapper = styled.div`
    margin: 1em 0 1em;

    border: solid white 1px;

    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
`

export default FilterGroup
