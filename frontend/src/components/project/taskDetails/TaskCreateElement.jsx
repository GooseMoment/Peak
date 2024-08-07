import { useNavigate } from "react-router-dom"

import ModalPortal from "@components/common/ModalPortal"

import TaskCreate from "./TaskCreate"

const TaskCreateElement = () => {
    /* 현재 url 기준으로 useState default값 정하기*/
    const navigate = useNavigate()

    const closeCreate = () => {
        navigate(`..`)
    }

    return (
        <ModalPortal closeModal={closeCreate}>
            <TaskCreate />
        </ModalPortal>
    )
}

export default TaskCreateElement
