import { useEffect, useRef, useState } from "react"

import styled from "styled-components"

import MildButton from "@components/common/MildButton"
import FilterInput from "@components/search/FilterInput"

const FilterButton = ({
    filter,
    updateFilterValue,
    inputState,
    setInputState,
}) => {
    const [inputPosition, setInputPosition] = useState({ top: 0, left: 0 })

    const buttonRef = useRef(null)

    const handleInputState = () => {
        setInputState(filter.name)

        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setInputPosition({
                top: window.scrollY + rect.top + rect.height,
                left: rect.left,
            })
        }
    }

    const displayFilterValue = () => {
        if(!filter.value) return null

        if(filter.type === "text") {
            return filter.value
        } else if(filter.type === "date") {
            const options = {
                month: 'short',
                day: 'numeric'
            }

            const startDate = new Date(filter.value.startDate).toLocaleString(navigator.language, options)
            const endDate = new Date(filter.value.endDate).toLocaleString(navigator.language, options)

            if (startDate === endDate) return startDate

            return startDate + " - " + endDate
        }
    }

    return (
        <>
            <ButtonBox
                ref={buttonRef}
                onClick={handleInputState}
                $isActive={filter.value !== null || inputState === filter.name}>
                {filter.value !== null || inputState === filter.name
                    ? filter.name + " : "
                    : filter.name}

                {inputState === filter.name ? (
                    <FilterInput
                        type={filter.type}
                        setInputState={setInputState}
                        filter={filter}
                        updateFilterValue={updateFilterValue}
                        position={inputPosition}
                    />
                ) : // position 고민해볼 필요...
                displayFilterValue()
                // filter.type === "date" ? (
                //     filter.value && 
                // ) : (
                //     filter.value
                // )
                }
            </ButtonBox>
        </>
    )
}

const ButtonBox = styled(MildButton)`
    max-width: 100%;

    border: solid ${(p) => p.theme.search.borderColor} 1px;
    border-radius: 0.8em;
    padding: 0.5em 0.8em 0.5em;
    background-color: ${(props) =>
        props.$isActive
            ? props.theme.search.activatedBackgroundColor
            : props.theme.backgroundColor};

    font-weight: ${(props) => (props.$isActive ? 700 : 400)};
    font-size: 1em;
    line-height: 1.1em;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

export default FilterButton
