import { useState } from "react"

import styled from "styled-components"

import FilterButton from "@components/search/FilterButton"

const FilterGroup = ({ filters, setFilters, handleSearch }) => {
    const [inputState, setInputState] = useState(false)

    const updateFilterValue = (filterName) => (filterValue) => {
        setFilters((prev) => {
            const newFilters = {
                ...prev,
                [filterName]: {
                    ...prev[filterName],
                    value: filterValue ? filterValue : null,
                },
            }

            handleSearch(newFilters)

            return newFilters
        })
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

    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
`

export default FilterGroup
