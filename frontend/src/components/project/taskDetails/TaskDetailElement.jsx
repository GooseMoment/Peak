import { useNavigate } from "react-router-dom"

import ModalPortal from "@components/common/ModalPortal"
import TaskDetail from "./TaskDetail"

const TaskDetailElement = () => {
    /* 현재 url 기준으로 useState default값 정하기*/
    const navigate = useNavigate()

    const closeDetail = () => {
        navigate(`..`)
    }

    return (
        <ModalPortal closeModal={closeDetail}>
            <TaskDetail />
        </ModalPortal>
    )
}

export default TaskDetailElement
