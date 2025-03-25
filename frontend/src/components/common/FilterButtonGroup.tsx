import {
    type Dispatch,
    type SetStateAction,
    useCallback,
    useMemo,
    useState,
} from "react"

import styled from "styled-components"

import MildButton from "@components/common/MildButton"

import { cubicBeizer } from "@assets/keyframes"

interface Filter {
    display: string
}

interface FilterButtonGroupProp {
    active: string
    setActive: Dispatch<SetStateAction<string>>
    filters: { [name: string]: Filter }
}

const FilterButtonGroup = ({
    active,
    setActive,
    filters,
}: FilterButtonGroupProp) => {
    const [selectedButtonPosition, setSelectedButtonPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
    })

    const onRefChange = useCallback(
        (node: HTMLElement | null) => {
            if (!node) {
                // node is null when this component is unmounted
                return
            }

            setSelectedButtonPosition({
                top: node.offsetTop,
                left: node.offsetLeft,
                width: node.offsetWidth,
            })
        },
        [filters],
    )

    const filterEntries = useMemo(() => Object.entries(filters), [filters])

    return (
        <FilterGroupWrapper>
            <FilterGroup>
                <BackgroundButton
                    $top={selectedButtonPosition.top}
                    $left={selectedButtonPosition.left}
                    $width={selectedButtonPosition.width}
                />
                {filterEntries.map(([name, { display }]) => (
                    <FilterButton
                        ref={active === name ? onRefChange : undefined}
                        key={name}
                        onClick={() => setActive(name)}>
                        {display}
                    </FilterButton>
                ))}
            </FilterGroup>
        </FilterGroupWrapper>
    )
}

const FilterGroupWrapper = styled.div`
    display: block;
    overflow-y: visible;
    overflow-x: auto;
`

const FilterGroup = styled.div`
    display: inline-flex;
    position: relative;
    justify-content: space-between;
    gap: 0.25em;

    background-color: ${(p) => p.theme.secondBackgroundColor};
    border-radius: 60px;
    padding: 0.3em;
`

const FilterButton = styled(MildButton)`
    flex: 1 1 auto;

    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 50px;
    padding: 0.5rem 0.75rem;
    white-space: nowrap;

    cursor: pointer;

    z-index: 3;
`

interface BackgroundButtonProp {
    $top: number
    $left: number
    $width: number
}

const BackgroundButton = styled(MildButton)<BackgroundButtonProp>`
    position: absolute;

    top: ${(props) => props.$top - 1}px;
    left: ${(props) => props.$left}px;
    width: ${(props) => props.$width}px;

    transition:
        top 0.25s ${cubicBeizer},
        left 0.25s ${cubicBeizer},
        width 0.25s ${cubicBeizer};

    height: calc(1em + 1rem);

    background-color: ${(p) => p.theme.backgroundColor};
    border-radius: 50px;
    filter: drop-shadow(2px 2px 3px #00000041);

    z-index: 2;
`

export default FilterButtonGroup
