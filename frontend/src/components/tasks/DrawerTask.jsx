import { useState } from "react"

import styled from "styled-components"

import DeleteAlert from "@components/common/DeleteAlert"
import { useDeleteTask } from "@components/project/common/useDeleteTask"
import DragAndDownBox from "@components/project/dragAndDown/DragAndDownBox"
import Task from "@components/tasks/Task"

import useScreenType from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const DrawerTask = ({ task, color, projectType }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.delete" })
    const { isMobile } = useScreenType()

    const [isAlertOpen, setIsAlertOpen] = useState(false)

    const { handleAlert, handleDelete } = useDeleteTask({
        task,
        projectType,
        setIsAlertOpen,
    })

    return (
        <DragAndDownBox task={task} color={color}>
            <TaskBox>
                <Task task={task} color={color} />
                {isMobile ? null : (
                    <DeleteIcon>
                        <FeatherIcon icon="trash-2" onClick={handleAlert} />
                    </DeleteIcon>
                )}
            </TaskBox>
            {isAlertOpen && (
                <DeleteAlert
                    title={t("alert_task_title", {
                        task_name: task.name,
                    })}
                    onClose={() => {
                        setIsAlertOpen(false)
                    }}
                    func={handleDelete}
                />
            )}
        </DragAndDownBox>
    )
}

const DeleteIcon = styled.div`
    display: none;
    cursor: pointer;
    margin-left: 1em;

    & svg {
        top: 0;
        stroke: ${(p) => p.theme.project.danger};
    }
`

const TaskBox = styled.div`
    display: flex;
    align-items: center;

    &:hover {
        ${DeleteIcon} {
            display: block;
        }
    }
`

export default DrawerTask
