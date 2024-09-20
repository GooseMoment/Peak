import { useState } from "react"

import styled from "styled-components"

import FilterButton from "@components/search/FilterButton"

const FilterGroup = ({ filters, handleSearch }) => {
    const [inputState, setInputState] = useState(false)

    return (
        <FilterGroupWrapper>
            {Object.entries(filters).map(
                ([name, filter]) =>
                    name !== "searchTerms" && (
                        <FilterButton
                            key={name}
                            filter={filter}
                            updateFilterValue={handleSearch(name)}
                            inputState={inputState}
                            setInputState={setInputState}
                        />
                    ),
            )}
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
