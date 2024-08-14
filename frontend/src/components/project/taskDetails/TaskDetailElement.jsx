import { useNavigate } from "react-router-dom"

import ModalWindow from "@components/common/ModalWindow"

import TaskDetail from "./TaskDetail"

const TaskDetailElement = () => {
    /* 현재 url 기준으로 useState default값 정하기*/
    const navigate = useNavigate()

    const closeDetail = () => {
        navigate(`..`)
    }

    return (
        <ModalWindow afterClose={closeDetail}>
            <TaskDetail />
        </ModalWindow>
    )
}

export default TaskDetailElement
