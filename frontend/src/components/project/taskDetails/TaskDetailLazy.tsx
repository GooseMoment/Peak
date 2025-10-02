import { Suspense, lazy } from "react"

import ModalLoader from "@components/common/ModalLoader"

import type { Task } from "@api/tasks.api"

import { Modal, Portal } from "@utils/useModal"
import useScreenType from "@utils/useScreenType"

const TaskDetail = lazy(
    () => import("@components/project/taskDetails/TaskDetail"),
)
const TaskDetailMobile = lazy(
    () => import("@components/project/taskDetails/mobile/TaskDetailMobile"),
)

interface TaskDetailLazyProps {
    task: Task
    modal: Modal
}

export default function TaskDetailLazy({ task, modal }: TaskDetailLazyProps) {
    const { isMobile } = useScreenType()

    if (isMobile) {
        return modal.isOpen ? (
            <Suspense fallback={<ModalLoader />}>
                <TaskDetailMobile task={task} closeDetail={modal.closeModal} />
            </Suspense>
        ) : null
    }

    return (
        <Portal modal={modal}>
            <Suspense fallback={<ModalLoader />}>
                <TaskDetail task={task} />
            </Suspense>
        </Portal>
    )
}
