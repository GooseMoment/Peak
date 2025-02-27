import ModalWindow from "@components/common/ModalWindow"
import TaskCreate from "@components/project/taskDetails/TaskCreate"
import TaskCreateMobile from "@components/project/taskDetails/mobile/TaskCreateMobile"

import useScreenType from "@utils/useScreenType"

const TaskCreateElement = ({ onClose, project, drawer, color }) => {
    const { isMobile } = useScreenType()

    return isMobile ? (
        <TaskCreateMobile
            closeCreate={onClose}
            project={project}
            drawer={drawer}
            color={color}
        />
    ) : (
        <ModalWindow afterClose={onClose}>
            <TaskCreate project={project} drawer={drawer} color={color} />
        </ModalWindow>
    )
}

export default TaskCreateElement
