import ModalWindow from "@components/common/ModalWindow"
import TaskDetail from "@components/project/taskDetails/TaskDetail"
import TaskDetailMobile from "@components/project/taskDetails/mobile/TaskDetailMobile"

import useScreenType from "@utils/useScreenType"

const TaskDetailElement = ({ onClose, projectType, color, task }) => {
    const { isMobile } = useScreenType()

    return isMobile ? (
        <TaskDetailMobile closeDetail={onClose} color={color} task={task} />
    ) : (
        <ModalWindow afterClose={onClose}>
            <TaskDetail projectType={projectType} color={color} task={task} />
        </ModalWindow>
    )
}

export default TaskDetailElement
