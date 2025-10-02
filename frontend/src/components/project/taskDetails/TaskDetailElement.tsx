import TaskDetail from "@components/project/taskDetails/TaskDetail"
import TaskDetailMobile from "@components/project/taskDetails/mobile/TaskDetailMobile"

import type { Task } from "@api/tasks.api"

import { Modal, Portal } from "@utils/useModal"
import useScreenType from "@utils/useScreenType"

interface TaskDetailElementProps {
    task: Task
    modal: Modal
}

export default function TaskDetailElement({
    task,
    modal,
}: TaskDetailElementProps) {
    const { isMobile } = useScreenType()

    if (isMobile) {
        return modal.isOpen ? (
            <TaskDetailMobile task={task} closeDetail={modal.closeModal} />
        ) : null
    }

    return (
        <Portal modal={modal}>
            <TaskDetail task={task} />
        </Portal>
    )
}
