import { useNavigate, useOutletContext } from "react-router-dom"

import ModalWindow from "@components/common/ModalWindow"
import TaskDetail from "@components/project/taskDetails/TaskDetail"

const TaskDetailElement = () => {
    const navigate = useNavigate()

    const [projectID] = useOutletContext()

    const closeDetail = () => {
        navigate(`/app/projects/${projectID}`)
    }

    return (
        <ModalWindow afterClose={closeDetail}>
            <TaskDetail />
        </ModalWindow>
    )
}

export default TaskDetailElement
