import styled, { css } from "styled-components"

import priority2 from "@assets/project/priority/priority2.svg"
import priority1 from "@assets/project/priority/priority1.svg"
import priority0 from "@assets/project/priority/priority0.svg"

const Priority = ({priority, completed}) => {

    
    const prioritys = [
        <PriorityImg $completed={completed} src={priority0}/>,
        <PriorityImg $completed={completed} src={priority1}/>,
        <PriorityImg $completed={completed} src={priority2}/>,
    ]

    return (
        prioritys[priority]
    )
}

const PriorityImg = styled.img`
    width: 15px;
    height: 15px;
    margin-top: 0.2em;
    margin-right: 0.2em;
    filter: ${(props) => (props.$completed && css`
    invert(73%) sepia(3%) saturate(9%) hue-rotate(349deg) brightness(89%) contrast(92%);
    `)};
`

export default Priority