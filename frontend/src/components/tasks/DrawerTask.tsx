import { useRef, useState } from "react"

import styled from "styled-components"

import DeleteAlert from "@components/common/DeleteAlert"
import { useDeleteTask } from "@components/project/common/useDeleteTask"
import TaskBlock from "@components/tasks/TaskBlock"

import { type Task } from "@api/tasks.api"

import useScreenType from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"
import { useDrag, useDrop } from "react-dnd"
import { useTranslation } from "react-i18next"

interface DrawerTaskProps {
    task: Task
    moveTask: (dragIndex: number, hoverIndex: number) => void
    dropTask: () => void
    isPending: boolean
}

const DrawerTask = ({
    task,
    moveTask,
    dropTask,
    isPending,
}: DrawerTaskProps) => {
    const { t } = useTranslation("translation", { keyPrefix: "task.delete" })
    const { isMobile } = useScreenType()

    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)

    const { handleAlert, handleDelete } = useDeleteTask({
        task,
        setIsAlertOpen,
    })

    /// Task Drag and Drop
    const ref = useRef<HTMLDivElement>(null)

    const [{ handlerId }, drop] = useDrop({
        accept: "Task",
        canDrop: (item: Task) =>
            !isPending && item.drawer.id === task.drawer.id,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover: (item, monitor) => {
            if (!ref.current || item.drawer.id !== task.drawer.id) return

            const dragOrder = item.order
            const hoverOrder = task.order

            if (dragOrder === hoverOrder) return

            const hoverBoundingRect = ref.current.getBoundingClientRect()
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()

            if (!clientOffset) return
            const hoverClientY = clientOffset.y - hoverBoundingRect.top

            if (dragOrder < hoverOrder && hoverClientY < hoverMiddleY) return
            if (dragOrder > hoverOrder && hoverClientY > hoverMiddleY) return

            if (item.order !== hoverOrder) {
                moveTask(dragOrder, hoverOrder)
                item.order = hoverOrder
            }
        },
        drop: (item) => {
            if (isPending) return
            dropTask()
            item.order = task.order
        },
    })

    const [{ isDragging }, drag] = useDrag({
        type: "Task",
        item: () => {
            return { id: task.id, order: task.order, drawerId: task.drawer }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    drag(drop(ref))
    /// ---

    return (
        <>
            <TaskBox
                ref={ref}
                data-handler-id={handlerId}
                $isDragging={isDragging}>
                <TaskBlock task={task} />
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
        </>
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

const TaskBox = styled.div<{ $isDragging: boolean }>`
    display: flex;
    align-items: center;
    cursor: grab;
    opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};

    &:hover {
        ${DeleteIcon} {
            display: block;
        }
    }
`

export default DrawerTask
