import styled, { css } from "styled-components"

import Priority0 from "@assets/project/priority/Priority0"
import Priority1 from "@assets/project/priority/Priority1"
import Priority2 from "@assets/project/priority/Priority2"

const priorityIcons = [<Priority0 />, <Priority1 />, <Priority2 />]

const Priority = ({ priority = 0, completed, hasDate }) => {
    return (
        <PriorityImg
            draggable="false"
            $completed={completed}
            $hasDate={hasDate}>
            {priorityIcons[priority]}
        </PriorityImg>
    )
}

const PriorityImg = styled.div`
    margin-top: ${(p) => (p.$hasDate ? "0.5em" : "0em")};
    margin-right: 0.2em;

    & svg {
        width: 15px;
        height: 15px;
        stroke: ${(p) =>
            p.$completed ? p.theme.grey : p.theme.project.danger};
    }
`

export default Priority
