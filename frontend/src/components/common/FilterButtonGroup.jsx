import { useCallback, useState } from "react"

import MildButton from "@components/common/MildButton"
import { cubicBeizer } from "@assets/keyframes"

import styled from "styled-components"

const FilterButtonGroup = ({active, setActive, filters}) => {
    const [selectedButtonPosition, setSelectedButtonPosition] = useState({top: "0.5em", left: 0, width: 0})

    const onRefChange = useCallback(node => {
        if (!node) {
            return
        }

        setSelectedButtonPosition({
            top: node.offsetTop,
            left: node.offsetLeft,
            width: node.offsetWidth,
        })
    }, [])

    return <FilterGroup>
        <BackgroundButton 
            $top={selectedButtonPosition.top} $left={selectedButtonPosition.left} $width={selectedButtonPosition.width} />
        {Object.entries(filters).map(([name, filter]) => 
            <FilterButton ref={active === name ? onRefChange : undefined} key={name} onClick={e => setActive(name)} $active={active === name}>{filter.display}</FilterButton>)
        }
    </FilterGroup>
}

const FilterGroup = styled.div`
display: inline-flex;
position: relative;
justify-content: space-between;
gap: 0.25em;

background-color: #F3F3F3;
border-radius: 60px;
padding: 0.3em;
`

const FilterButton = styled(MildButton)`
flex: 1 1 auto;

font-size: 0.9rem;
font-weight: 500;
border-radius: 50px;
padding: 0.5rem 0.75rem;

cursor: pointer;

z-index: 3;
`

const BackgroundButton = styled(MildButton)`
    position: absolute;

    top: ${props => props.$top - 1}px;
    left: ${props => props.$left}px;
    width: ${props => props.$width}px;

    transition: top 0.25s ${cubicBeizer}, left 0.25s ${cubicBeizer}, width 0.25s ${cubicBeizer};

    height: calc(1em + 1rem);

    background-color: white;
    border-radius: 50px;
    filter: drop-shadow(2px 2px 3px #00000041);

    z-index: 2;
`

export default FilterButtonGroup