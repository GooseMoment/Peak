import { useNavigate, useOutletContext } from "react-router-dom"

import ModalWindow from "@components/common/ModalWindow"
import ModalBottomSheet from "@components/common/ModalBottomSheet"
import TaskCreate from "@components/project/taskDetails/TaskCreate"

import useScreenType from "@utils/useScreenType"
import TaskCreateMobile from "./mobile/TaskCreateMobile"

const TaskCreateElement = () => {
    /* 현재 url 기준으로 useState default값 정하기*/
    const navigate = useNavigate()
    const { isMobile } = useScreenType()

    const [projectId] = useOutletContext()

    const closeCreate = () => {
        navigate(`/app/projects/${projectId}`)
    }

    return (
        isMobile ?
        <ModalBottomSheet onClose={closeCreate}>
            <TaskCreateMobile closeCreate={closeCreate}/>
        </ModalBottomSheet> :
        <ModalWindow afterClose={closeCreate}>
            <TaskCreate />
        </ModalWindow>
    )
}

export default TaskCreateElement
