import { useRef, useState } from "react"

import styled from "styled-components"

import MildButton from "@components/common/MildButton"
import FilterInput from "@components/search/FilterInput"

import { useClientLocale } from "@utils/clientSettings"
import { ifMobile } from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"

const FilterButton = ({
    filter,
    updateFilterValue,
    inputState,
    setInputState,
}) => {
    const locale = useClientLocale()

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
        if (!filter.value) return null

        if (filter.type === "text") {
            return filter.value
        } else if (filter.type === "date") {
            const options = {
                month: "short",
                day: "numeric",
            }

            const startDate = new Date(filter.value.startDate).toLocaleString(
                locale,
                options,
            )
            const endDate = new Date(filter.value.endDate).toLocaleString(
                locale,
                options,
            )

            if (startDate === endDate) return startDate

            return startDate + " - " + endDate
        }
    }

    const handleClear = (e) => {
        e.stopPropagation()
        updateFilterValue(null)
    }

    return (
        <ButtonBox
            ref={buttonRef}
            onClick={handleInputState}
            $isActive={filter.value !== null || inputState === filter.name}>
            {filter.value !== null || inputState === filter.name
                ? filter.name + ": "
                : filter.name}

            {inputState === filter.name ? (
                <FilterInput
                    setInputState={setInputState}
                    filter={filter}
                    updateFilterValue={updateFilterValue}
                    position={inputPosition}
                />
            ) : (
                // position 고민해볼 필요...
                displayFilterValue()
            )}

            {filter.value !== null && inputState !== filter.name && (
                <ClearButton onClick={handleClear}>
                    <FeatherIcon icon="x-circle" />
                </ClearButton>
            )}
        </ButtonBox>
    )
}

const ButtonBox = styled.div`
    max-width: 100%;
    position: relative;

    border: solid ${(p) => p.theme.search.borderColor} 1px;
    border-radius: 0.8em;
    padding: 0.5em 1em 0.5em;
    background-color: ${(props) =>
        props.$isActive
            ? props.theme.search.activatedBackgroundColor
            : props.theme.backgroundColor};

    font-weight: ${(props) => (props.$isActive ? 700 : 400)};
    font-size: 1em;
    line-height: 1.1em;
    display: flex;
    justify-content: center;
    align-items: center;

    ${ifMobile} {
        padding: 0.5em ${(props) => (props.$isActive ? 1.75 : 1)}em 0.5em 1em;
    }
`

const ClearButton = styled(MildButton)`
    position: absolute;
    right: 0.5em;

    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.9em;

    transition: all 0.2s ease;

    &:hover {
        opacity: 100%;
    }

    & svg {
        top: unset;
        margin-right: unset;

        box-shadow: 0 0 1em 0.2em
            ${(props) => props.theme.search.activatedBackgroundColor};
        border-radius: 100%;
        padding: 0.1em;
        background-color: ${(props) =>
            props.theme.search.activatedBackgroundColor};
    }

    ${ifMobile} {
        opacity: 100%;
    }
`

export default FilterButton
