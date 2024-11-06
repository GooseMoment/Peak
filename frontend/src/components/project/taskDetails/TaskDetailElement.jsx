import { useNavigate, useOutletContext } from "react-router-dom"

import ModalWindow from "@components/common/ModalWindow"
import TaskDetail from "@components/project/taskDetails/TaskDetail"
import TaskDetailMobile from "@components/project/taskDetails/mobile/TaskDetailMobile"

import useScreenType from "@utils/useScreenType"

const TaskDetailElement = () => {
    const navigate = useNavigate()
    const { isMobile } = useScreenType()

    const [projectID] = useOutletContext()

    const closeDetail = () => {
        navigate(`/app/projects/${projectID}`)
    }

    return isMobile ? (
        <TaskDetailMobile closeDetail={closeDetail} />
    ) : (
        <ModalWindow afterClose={closeDetail}>
            <TaskDetail />
        </ModalWindow>
    )
}

export default TaskDetailElement
