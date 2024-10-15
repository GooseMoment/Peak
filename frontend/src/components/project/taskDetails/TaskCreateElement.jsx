import { useNavigate, useOutletContext } from "react-router-dom"

import ModalWindow from "@components/common/ModalWindow"
import TaskCreate from "@components/project/taskDetails/TaskCreate"

const TaskCreateElement = () => {
    const navigate = useNavigate()

    const [projectID] = useOutletContext()

    const closeCreate = () => {
        navigate(`/app/projects/${projectID}`)
    }

    return (
        <ModalWindow afterClose={closeCreate}>
            <TaskCreate />
        </ModalWindow>
    )
}

export default TaskCreateElement
