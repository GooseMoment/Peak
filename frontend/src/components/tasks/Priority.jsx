import priority2 from "@assets/project/priority/priority2.svg"
import priority1 from "@assets/project/priority/priority1.svg"
import priority0 from "@assets/project/priority/priority0.svg"

import styled, { css } from "styled-components"

const Priority = ({priority, completed, hasDate}) => {
    const prioritys = [
        <PriorityImg $completed={completed} $hasDate={hasDate} src={priority0}/>,
        <PriorityImg $completed={completed} $hasDate={hasDate} src={priority1}/>,
        <PriorityImg $completed={completed} $hasDate={hasDate} src={priority2}/>,
    ]

    return prioritys[priority]
}

const PriorityImg = styled.img`
    width: 15px;
    height: 15px;
    margin-top: ${p => p.$hasDate ? "-0.5em" : "-0.25em"};
    margin-right: 0.2em;
    filter: ${p => p.theme.project.imgDangerColor};

    ${(props) => (props.$completed && css`
        filter: ${p => p.theme.project.imgGreyColor};
    `)}
`

export default Priority