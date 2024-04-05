import priority2 from "@assets/project/priority/priority2.svg"
import priority1 from "@assets/project/priority/priority1.svg"

const Priority = ({priority}) => {
    return (
        prioritys[priority]
    )
}

const prioritys = [
    <div/>,
    <img src={priority1}/>,
    <img src={priority2}/>,
]

export default Priority