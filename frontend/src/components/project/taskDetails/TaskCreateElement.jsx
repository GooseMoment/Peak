import { useNavigate, useOutletContext } from "react-router-dom"

import ModalWindow from "@components/common/ModalWindow"
import TaskCreate from "@components/project/taskDetails/TaskCreate"

const TaskCreateElement = () => {
    /* 현재 url 기준으로 useState default값 정하기*/
    const navigate = useNavigate()

    const [projectId] = useOutletContext()

    const closeCreate = () => {
        navigate(`/app/projects/${projectId}`)
    }

    return (
        <ModalWindow afterClose={closeCreate}>
            <TaskCreate />
        </ModalWindow>
    )
}

export default TaskCreateElement
