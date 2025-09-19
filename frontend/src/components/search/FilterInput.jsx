import { useEffect, useRef, useState } from "react"

import styled from "styled-components"

import CalendarModal from "@components/search/CalendarModal"

const FilterInput = ({
    setInputState,
    filter,
    updateFilterValue,
    position,
}) => {
    // text type
    const [inputText, setInputText] = useState(filter.value || "")
    const ghostSpanRef = useRef(null)
    const [inputWidth, setInputWidth] = useState(0)
    useEffect(() => {
        if (ghostSpanRef.current) {
            const width = ghostSpanRef.current.getBoundingClientRect().width
            setInputWidth(width)
        }
    }, [inputText])

    const handleChange = (e) => {
        setInputText(e.target.value)
    }

    const handleKeyDown = (e) => {
        if (e.key == "Enter") {
            setInputState(false)
            const trimmedText = inputText.trim()
            setInputText(trimmedText)
            updateFilterValue(trimmedText)
        }
    }

    const handleBlur = () => {
        setInputState(false)
        const trimmedText = inputText.trim()
        setInputText(trimmedText)
        updateFilterValue(trimmedText)
    }

    // date type
    const [isModalOpen, setIsModalOpen] = useState(true)
    useEffect(() => {
        if (!isModalOpen) setInputState(null)
    }, [isModalOpen, setInputState])

    if (filter.type === "text")
        return (
            <>
                <GhostSpan ref={ghostSpanRef}>{inputText}</GhostSpan>
                <TextForm
                    type="text"
                    value={inputText}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    $length={inputWidth}
                    autoFocus
                />
            </>
        )
    else if (filter.type === "date") {
        return (
            <CalendarModal
                isOpen={isModalOpen}
                handleClose={() => setIsModalOpen(null)}
                position={position}
                filter={filter}
                updateFilterValue={updateFilterValue}
            />
        )
    } else return null
}

const GhostSpan = styled.span`
    position: absolute;

    opacity: 0%;

    white-space: pre-wrap;
    font-weight: 700;
    font-size: 1em;
`

const TextForm = styled.input`
    margin-left: 0.25em;
    width: ${(props) => props.$length}px;

    padding: 0;
    overflow-y: visible;

    font-weight: 700;
    font-size: 1em;
    line-height: 1.1em;
`

export default FilterInput
