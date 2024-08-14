import { useNavigate } from "react-router-dom"

import ModalWindow from "@components/common/ModalWindow"

import TaskCreate from "./TaskCreate"

const TaskCreateElement = () => {
    /* 현재 url 기준으로 useState default값 정하기*/
    const navigate = useNavigate()

    const closeCreate = () => {
        navigate(`..`)
    }

    return (
        <ModalWindow afterClose={closeCreate}>
            <TaskCreate />
        </ModalWindow>
    )
}

export default TaskCreateElement
