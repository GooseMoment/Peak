import ModalWindow from "@components/common/ModalWindow"
import TaskCreate from "@components/project/taskDetails/TaskCreate"
import TaskCreateMobile from "@components/project/taskDetails/mobile/TaskCreateMobile"

import { type Drawer } from "@api/drawers.api"

import useScreenType from "@utils/useScreenType"

const TaskCreateElement = ({
    drawer,
    onClose,
}: {
    drawer: Drawer
    onClose: () => void
}) => {
    const { isMobile } = useScreenType()

    return isMobile ? (
        <TaskCreateMobile drawer={drawer} closeCreate={onClose} />
    ) : (
        <ModalWindow afterClose={onClose}>
            <TaskCreate drawer={drawer} />
        </ModalWindow>
    )
}

export default TaskCreateElement
