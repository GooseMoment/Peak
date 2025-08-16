import ModalWindow from "@components/common/ModalWindow"
import TaskDetail from "@components/project/taskDetails/TaskDetail"
import TaskDetailMobile from "@components/project/taskDetails/mobile/TaskDetailMobile"

import { type Task } from "@api/tasks.api"

import useScreenType from "@utils/useScreenType"

const TaskDetailElement = ({
    task,
    onClose,
}: {
    task: Task
    onClose: () => void
}) => {
    const { isMobile } = useScreenType()

    return isMobile ? (
        <TaskDetailMobile task={task} closeDetail={onClose} />
    ) : (
        <ModalWindow afterClose={onClose}>
            <TaskDetail task={task} />
        </ModalWindow>
    )
}

export default TaskDetailElement
