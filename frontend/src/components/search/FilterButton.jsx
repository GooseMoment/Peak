import styled from "styled-components"

import MildButton from "@components/common/MildButton"

const FilterButton = ({ filter }) => {
    console.log(filter)
    
    return <ButtonBox>
        {filter.name}
    </ButtonBox>
}

const ButtonBox = styled(MildButton)`
    border: solid ${p => p.theme.search.borderColor} 1px;
    border-radius: 0.8em;
    padding: 0.5em 0.8em 0.5em;

    font-size: 1.1em;
`

export default FilterButton
