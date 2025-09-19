import { Dispatch, SetStateAction, useEffect } from "react"

import {
    ContentBox,
    CreateSimpleBox,
} from "@components/project/taskCreateSimple/CreateSimpleBox"
import addDateFromToday from "@components/project/taskCreateSimple/addDateFromToday"

import { type MinimalTask } from "@api/tasks.api"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const SimpleAssigned = ({
    assignedIndex,
    setAssignedIndex,
    editNewTask,
    color,
}: {
    assignedIndex: number
    setAssignedIndex: Dispatch<SetStateAction<number>>
    editNewTask: (diff: Partial<MinimalTask>) => void
    color: string
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task.due.quick" })

    const onKeyDown = (e: KeyboardEvent | React.KeyboardEvent) => {
        if (e.key === "ArrowRight") {
            if (assignedIndex === 5) return
            setAssignedIndex(assignedIndex + 1)
        }
        if (e.key === "ArrowLeft") {
            if (assignedIndex === 0) return
            setAssignedIndex(assignedIndex - 1)
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown)

        return () => {
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [assignedIndex])

    useEffect(() => {
        editNewTask({
            assigned_at: addDateFromToday(items[assignedIndex].set),
        })
    }, [assignedIndex])

    const items = [
        { index: 0, display: t("no_date"), set: null },
        { index: 1, display: t("today"), set: { days: 0 } },
        { index: 2, display: t("tomorrow"), set: { days: 1 } },
        {
            index: 3,
            display: t("next_week"),
            set: { days: 7 },
        },
        {
            index: 4,
            display: t("next_two_weeks"),
            set: { days: 14 },
        },
        {
            index: 5,
            display: t("next_month"),
            set: { months: 1 },
        },
    ]

    return (
        <div onKeyDown={onKeyDown}>
            <CreateSimpleBox icon={<FeatherIcon icon="calendar" />}>
                {items.map((item, index) => (
                    <ContentBox
                        key={item.display}
                        $color={color}
                        $isActive={assignedIndex === index}
                        onClick={() => setAssignedIndex(index)}>
                        {assignedIndex === index && (
                            <FeatherIcon icon="check" />
                        )}
                        {item.display}
                    </ContentBox>
                ))}
            </CreateSimpleBox>
        </div>
    )
}

export default SimpleAssigned
