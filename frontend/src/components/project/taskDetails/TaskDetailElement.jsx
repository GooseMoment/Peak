import { useNavigate, useOutletContext } from "react-router-dom"

import ModalWindow from "@components/common/ModalWindow"
import TaskDetail from "@components/project/taskDetails/TaskDetail"

const TaskDetailElement = () => {
    /* 현재 url 기준으로 useState default값 정하기*/
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
