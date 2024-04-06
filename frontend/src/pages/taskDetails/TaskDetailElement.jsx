import { Outlet, useNavigate } from "react-router-dom"
import { useState } from "react"

import ModalPortal from "@components/common/ModalPortal"
import TaskCreateDetail from "./TaskCreateDetail"

const TaskDetailElement = () => {
    /* 현재 url 기준으로 useState default값 정하기*/
    const [isComponentOpen, setIsComponentOpen] = useState(false)
    const navigate = useNavigate()

    const closeComponent = () => {
        setIsComponentOpen(false)
        navigate(`.`)
    }

    return <ModalPortal>
        <TaskCreateDetail setIsComponentOpen={setIsComponentOpen}/>
        { isComponentOpen && <ModalPortal additional>
            <Outlet context={[closeComponent]} />
        </ModalPortal>}
    </ModalPortal>
}

export default TaskDetailElement