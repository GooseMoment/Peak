import priority2 from "@assets/project/priority/priority2.svg"
import priority1 from "@assets/project/priority/priority1.svg"
import styled from "styled-components"

const Priority = ({priority, completed}) => {
    const prioritys = [
        <MarginBlock/>,
        <img src={priority1}/>,
        <img src={priority2}/>,
    ]

    return (
        prioritys[priority]
    )
}

const MarginBlock = styled.div`
    margin: 0.6em;
`

export default Priority