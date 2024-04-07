import priority2 from "@assets/project/priority/priority2.svg"
import priority1 from "@assets/project/priority/priority1.svg"
import priority0 from "@assets/project/priority/priority0.svg"

const Priority = ({priority, completed}) => {
    const prioritys = [
        <img src={priority0}/>,
        <img src={priority1}/>,
        <img src={priority2}/>,
    ]

    return (
        prioritys[priority]
    )
}

export default Priority