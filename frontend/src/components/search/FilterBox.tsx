import { useState, useRef, useEffect } from "react"
import styled from "styled-components"
import { FilterValues, FilterLabel } from "@components/search/Filters"
import FilterInput from "@components/search/FilterInput"
import MildButton from "@components/common/MildButton"

import { ifMobile } from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"

interface FilterBoxProps<K extends FilterLabel> {
    filterDisplay: string
    filterValue: FilterValues[K]
    setFilterValue: (value: FilterValues[K]) => void
}

type Position = {
    top: number
    left: number
}

// TODO: 버튼 누르면 깜빡거리는 이유는 알겠지만 고치는 건 모르겠다...
const FilterBox = <K extends FilterLabel>({ filterDisplay, filterValue, setFilterValue }: FilterBoxProps<K>) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)

    const boxRef = useRef<HTMLDivElement>(null)
    
    // TODO: Calendar 사용 위함
    const [inputPosition, setInputPosition] = useState<Position>({ top: 0, left: 0 })
    
    const handleInputState = () => {
        setIsEditing(true)

        if (boxRef.current) {
            const rect = boxRef.current.getBoundingClientRect()
            setInputPosition({
                top: window.scrollY + rect.top + rect.height,
                left: rect.left,
            })
        }
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsEditing(false)
        setFilterValue("")
    }

    return <Box onClick={handleInputState}>
        {filterDisplay + (isEditing || !!filterValue ? ": " : "")}
        {isEditing ? 
            <FilterInput setIsEditing={setIsEditing} filterValue={filterValue} setFilterValue={setFilterValue}/>
            :
            filterValue
        }
        {!!filterValue &&
            <ClearButton onClick={handleClear}>
                <FeatherIcon icon="x-circle" />
            </ClearButton>
        }
    </Box>
}

const Box = styled.div`
    border: 1.5px solid ${(p) => p.theme.textColor};
    border-radius: 16px;
    padding: 0.5em 0.75em;

    display: flex;
    align-items: center;
`

const ClearButton = styled(MildButton)`
    margin-right: -0.6em;

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

        border-radius: 100%;
        padding: 0.1em;
    }

    ${ifMobile} {
        opacity: 100%;
    }
`


export default FilterBox