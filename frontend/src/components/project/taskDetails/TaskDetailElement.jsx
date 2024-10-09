import { useNavigate, useOutletContext } from "react-router-dom"

import ModalWindow from "@components/common/ModalWindow"
import ModalBottomSheet from "@components/common/ModalBottomSheet"
import TaskDetail from "@components/project/taskDetails/TaskDetail"

import useScreenType from "@utils/useScreenType"
import TaskDetailMobile from "./mobile/TaskDetailMobile"

const TaskDetailElement = () => {
    /* 현재 url 기준으로 useState default값 정하기*/
    const navigate = useNavigate()
    const { isMobile } = useScreenType()

    const [projectID] = useOutletContext()

    const closeDetail = () => {
        navigate(`/app/projects/${projectID}`)
    }

    return (
        isMobile ?
        <ModalBottomSheet onClose={closeDetail}>
            <TaskDetailMobile closeDetail={closeDetail}/>
        </ModalBottomSheet> :
        <ModalWindow afterClose={closeDetail}>
            <TaskDetail />
        </ModalWindow>
    )
}

export default TaskDetailElement
