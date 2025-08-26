import { Dispatch, SetStateAction, useEffect } from "react"

import {
    ContentBox,
    CreateSimpleBox,
} from "@components/project/taskCreateSimple/CreateSimpleBox"

import type { MinimalTask } from "@api/tasks.api"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const SimplePriority = ({
    priorityIndex,
    setPriorityIndex,
    editNewTask,
    color,
}: {
    priorityIndex: number
    setPriorityIndex: Dispatch<SetStateAction<number>>
    editNewTask: (diff: Partial<MinimalTask>) => void
    color: string
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task.priority" })

    const onKeyDown = (e: KeyboardEvent | React.KeyboardEvent) => {
        if (e.key === "ArrowRight") {
            if (priorityIndex === 2) return
            setPriorityIndex(priorityIndex + 1)
        }
        if (e.key === "ArrowLeft") {
            if (priorityIndex === 0) return
            setPriorityIndex(priorityIndex - 1)
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown)

        return () => {
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [priorityIndex])

    useEffect(() => {
        editNewTask({ priority: priorityIndex })
    }, [priorityIndex])

    const items = [
        { index: 0, content: t("normal") },
        { index: 1, content: t("important") },
        { index: 2, content: t("critical") },
    ]

    return (
        <div onKeyDown={onKeyDown}>
            <CreateSimpleBox icon={<FeatherIcon icon="alert-circle" />}>
                {items.map((item) => (
                    <ContentBox
                        key={item.index}
                        $color={color}
                        $isActive={priorityIndex === item.index}
                        onClick={() => setPriorityIndex(item.index)}>
                        {priorityIndex === item.index && (
                            <FeatherIcon icon="check" />
                        )}
                        {item.content}
                    </ContentBox>
                ))}
            </CreateSimpleBox>
        </div>
    )
}

export default SimplePriority
