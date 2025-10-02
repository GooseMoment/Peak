import { Suspense, lazy } from "react"

import ModalLoader from "@components/common/ModalLoader"

import type { Drawer } from "@api/drawers.api"

import { Modal, Portal } from "@utils/useModal"
import useScreenType from "@utils/useScreenType"

const TaskCreate = lazy(
    () => import("@components/project/taskDetails/TaskCreate"),
)

const TaskCreateMobile = lazy(
    () => import("@components/project/taskDetails/mobile/TaskCreateMobile"),
)

interface TaskCreateLazyProps {
    drawer: Drawer
    modal: Modal
}

export default function TaskCreateLazy({ drawer, modal }: TaskCreateLazyProps) {
    const { isMobile } = useScreenType()

    if (isMobile) {
        return modal.isOpen ? (
            <Suspense fallback={<ModalLoader />}>
                <TaskCreateMobile
                    drawer={drawer}
                    closeCreate={modal.closeModal}
                />
            </Suspense>
        ) : null
    }

    return (
        <Portal modal={modal}>
            <Suspense fallback={<ModalLoader />}>
                <TaskCreate drawer={drawer} />
            </Suspense>
        </Portal>
    )
}
