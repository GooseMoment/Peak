import { useNavigate, useOutletContext } from "react-router-dom"

import ModalWindow from "@components/common/ModalWindow"
import TaskCreate from "@components/project/taskDetails/TaskCreate"
import TaskCreateMobile from "@components/project/taskDetails/mobile/TaskCreateMobile"

import useScreenType from "@utils/useScreenType"

const TaskCreateElement = () => {
    const navigate = useNavigate()
    const { isMobile } = useScreenType()

    const [projectID] = useOutletContext()

    const closeCreate = () => {
        navigate(`/app/projects/${projectID}`)
    }

    return (
        isMobile ?
        <TaskCreateMobile closeCreate={closeCreate}/> :
        <ModalWindow afterClose={closeCreate}>
            <TaskCreate />
        </ModalWindow>
    )
}

export default TaskCreateElement
