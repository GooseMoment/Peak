import { useEffect, useRef, useState } from "react"

import styled from "styled-components"

import MildButton from "@components/common/MildButton"

const FilterButton = ({ filter, handleFilter, inputState, setInputState }) => {
    const [inputText, setInputText] = useState("")
    const ghostSpanRef = useRef(null)
    const [inputWidth, setInputWidth] = useState(0)

    useEffect(() => {
        if (ghostSpanRef.current) {
            const width = ghostSpanRef.current.getBoundingClientRect().width
            setInputWidth(width)
        }
    }, [inputText])

    const handleInputState = () => {
        setInputState(filter.name)
    }

    const handleChange = (e) => {
        setInputText(e.target.value)
    }

    const handleKeyDown = (e) => {
        if (e.key == "Enter") {
            setInputState(false)
            handleFilter(inputText)
        }
    }

    const handleBlur = () => {
        setInputState(false)
        handleFilter(inputText)
    }

    return (
        <ButtonBox onClick={handleInputState}>
            <GhostSpan ref={ghostSpanRef}>{inputText}</GhostSpan>

            {filter.value !== null || inputState === filter.name
                ? filter.name + " : "
                : filter.name}

            {inputState === filter.name ? (
                <FilterInput
                    type="text"
                    value={inputText}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    $length={inputWidth}
                    autoFocus
                />
            ) : (
                filter.value !== null && filter.value
            )}
        </ButtonBox>
    )
}

const GhostSpan = styled.span`
    position: absolute;

    opacity: 0%;
    font-size: 1em;
`

const ButtonBox = styled(MildButton)`
    border: solid ${(p) => p.theme.search.borderColor} 1px;
    border-radius: 0.8em;
    padding: 0.5em 0.8em 0.5em;

    font-size: 1em;
    line-height: 1.1em;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

const FilterInput = styled.input`
    margin-left: 0.25em;
    width: ${(props) => props.$length}px;

    padding: 0;
    overflow-y: visible;

    font-size: 1em;
    line-height: 1.1em;
`

export default FilterButton
