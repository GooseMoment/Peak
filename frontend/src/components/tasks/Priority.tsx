import styled from "styled-components"

import Priority0 from "@assets/project/priority/Priority0"
import Priority1 from "@assets/project/priority/Priority1"
import Priority2 from "@assets/project/priority/Priority2"

// eslint-disable-next-line react/jsx-key -- items are not used together
const priorityIcons = [<Priority0 />, <Priority1 />, <Priority2 />]

const Priority = ({
    priority = 0,
    isCompleted,
    hasDate,
}: {
    priority?: number
    isCompleted: boolean
    hasDate: boolean
}) => {
    return (
        <PriorityImg
            draggable="false"
            $isCompleted={isCompleted}
            $hasDate={hasDate}>
            {priorityIcons[priority]}
        </PriorityImg>
    )
}

const PriorityImg = styled.div<{ $isCompleted: boolean; $hasDate: boolean }>`
    margin-top: ${(p) => (p.$hasDate ? "0.5em" : "0em")};
    margin-right: 0.2em;

    & svg {
        width: 15px;
        height: 15px;
        stroke: ${(p) =>
            p.$isCompleted ? p.theme.grey : p.theme.project.danger};
    }
`

export default Priority
