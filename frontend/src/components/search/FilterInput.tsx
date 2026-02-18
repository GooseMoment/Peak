import { useState, useRef, useEffect } from "react"
import styled from "styled-components"
import { FilterValues, FilterLabel } from "@components/search/Filters"

interface FilterInputProps<K extends FilterLabel> {
    setIsEditing: (value: boolean) => void
    filterValue: FilterValues[K]
    setFilterValue: (value: string) => void
}

const FilterInput = <K extends FilterLabel>({ setIsEditing, filterValue, setFilterValue }: FilterInputProps<K>) => {
    const [inputValue, setInputValue] = useState<string>(filterValue || "")

    const ghostSpanRef = useRef<HTMLDivElement>(null)
    const [inputWidth, setInputWidth] = useState<number>(0)

    useEffect(() => {
        if (ghostSpanRef.current) {
            const width = ghostSpanRef.current.getBoundingClientRect().width
            setInputWidth(width)
        }
    }, [inputValue])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter") {
            setIsEditing(false)
            const trimmedText = inputValue.trim()
            setInputValue(trimmedText)
            setFilterValue(trimmedText)
        }
    }
    
    const handleBlur = () => {
        setIsEditing(false)
        const trimmedText = inputValue.trim()
        setInputValue(trimmedText)
        setFilterValue(trimmedText)
    }

    return (
        <>
            <GhostSpan ref={ghostSpanRef}>{inputValue}</GhostSpan>
            <TextForm
                type="text"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                $length={inputWidth}
                autoFocus
            />
        </>
    )
}

const GhostSpan = styled.span`
    position: absolute;

    opacity: 0%;

    white-space: pre-wrap;
    font-size: 1em;
`

const TextForm = styled.input<{ $length: number }>`
    margin-left: 0.25em;
    height: 1em;
    width: ${(props) => props.$length}px;

    padding: 0;
    overflow-y: visible;

    font-size: 1em;
    line-height: 1em;
`

export default FilterInput