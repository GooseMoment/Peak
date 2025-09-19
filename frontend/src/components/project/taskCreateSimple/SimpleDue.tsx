import { Dispatch, SetStateAction, useEffect, useMemo } from "react"

import {
    ContentBox,
    CreateSimpleBox,
} from "@components/project/taskCreateSimple/CreateSimpleBox"
import addDateFromToday from "@components/project/taskCreateSimple/addDateFromToday"

import type { MinimalTask } from "@api/tasks.api"

import Hourglass from "@assets/project/Hourglass"

import FeatherIcon from "feather-icons-react"
import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"

const SimpleDue = ({
    dueIndex,
    setDueIndex,
    editNewTask,
    color,
}: {
    dueIndex: number
    setDueIndex: Dispatch<SetStateAction<number>>
    editNewTask: (diff: Partial<MinimalTask>) => void
    color: string
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task.due.quick" })

    const onKeyDown = (e: KeyboardEvent | React.KeyboardEvent) => {
        if (e.key === "ArrowRight") {
            if (dueIndex === 5) return
            setDueIndex(dueIndex + 1)
        }
        if (e.key === "ArrowLeft") {
            if (dueIndex === 0) return
            setDueIndex(dueIndex - 1)
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown)

        return () => {
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [dueIndex])

    useEffect(() => {
        const new_due_date = addDateFromToday(items[dueIndex].set)

        if (dueIndex === 0 || new_due_date === null) {
            editNewTask({
                due_type: null,
                due_date: null,
                due_datetime: null,
            })
            return
        }

        editNewTask({
            due_type: "due_date",
            due_date: new_due_date,
            due_datetime: null,
        })
    }, [dueIndex])

    const items = useMemo(() => makeDueItems(t), [t])

    return (
        <div onKeyDown={onKeyDown}>
            <CreateSimpleBox icon={<Hourglass />}>
                {items.map((item) => (
                    <ContentBox
                        key={item.index}
                        $color={color}
                        $isActive={dueIndex === item.index}
                        onClick={() => setDueIndex(item.index)}>
                        {dueIndex === item.index && (
                            <FeatherIcon icon="check" />
                        )}
                        {item.display}
                    </ContentBox>
                ))}
            </CreateSimpleBox>
        </div>
    )
}

const makeDueItems = (t: TFunction<"translation", "task.due.quick">) => [
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

export default SimpleDue
