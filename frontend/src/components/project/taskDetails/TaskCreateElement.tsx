import TaskCreate from "@components/project/taskDetails/TaskCreate"
import TaskCreateMobile from "@components/project/taskDetails/mobile/TaskCreateMobile"

import type { Drawer } from "@api/drawers.api"

import { Modal, Portal } from "@utils/useModal"
import useScreenType from "@utils/useScreenType"

interface TaskCreateElementProps {
    drawer: Drawer
    modal: Modal
}

export default function TaskCreateElement({
    drawer,
    modal,
}: TaskCreateElementProps) {
    const { isMobile } = useScreenType()

    if (isMobile) {
        return modal.isOpen ? (
            <TaskCreateMobile drawer={drawer} closeCreate={modal.closeModal} />
        ) : null
    }

    return (
        <Portal modal={modal}>
            <TaskCreate drawer={drawer} />
        </Portal>
    )
}
