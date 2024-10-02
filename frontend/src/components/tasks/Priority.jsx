import styled, { css } from "styled-components"

import priority0 from "@assets/project/priority/priority0.svg"
import priority1 from "@assets/project/priority/priority1.svg"
import priority2 from "@assets/project/priority/priority2.svg"

const priorityIcons = [priority0, priority1, priority2]

const Priority = ({ priority, completed, hasDate }) => {
    return (
        <PriorityImg
            draggable="false"
            $completed={completed}
            $hasDate={hasDate}
            src={priorityIcons[priority]}
        />
    )
}

const PriorityImg = styled.img`
    width: 15px;
    height: 15px;
    margin-top: ${(p) => (p.$hasDate ? "-0.5em" : "-0.25em")};
    margin-right: 0.2em;
    filter: ${(p) => p.theme.project.imgDangerColor};

    ${(props) =>
        props.$completed &&
        css`
            filter: ${(p) => p.theme.project.imgGreyColor};
        `}
`

export default Priority
