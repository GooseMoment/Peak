import { useEffect } from "react"

import {
    ContentBox,
    CreateSimpleBox,
} from "@components/project/Creates/simple/CreateSimpleBox"
import addDateFromToday from "@components/project/Creates/utils/addDateFromToday"

import { useClientTimezone } from "@utils/clientSettings"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const SimpleAssigned = ({
    assignedIndex,
    setAssignedIndex,
    editNewTask,
    color,
}) => {
    const { t } = useTranslation(null, { keyPrefix: "task.due.quick" })
    const due_tz = useClientTimezone()

    const onKeyDown = (e) => {
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
            due_tz: due_tz,
            assigned_at: addDateFromToday(items[assignedIndex].set),
        })
    }, [assignedIndex])

    const items = [
        { index: 0, display: t("no_date"), set: null },
        { index: 1, display: t("today"), set: { days: 0 }},
        { index: 2, display: t("tomorrow"), set: { days: 1 }},
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
        <CreateSimpleBox
            onKeyDown={onKeyDown}
            icon={<FeatherIcon icon="calendar" />}>
            {items.map((item) => (
                <ContentBox
                    key={item.index}
                    $color={color}
                    $isActive={assignedIndex === item.index}
                    onClick={() => setAssignedIndex(item.index)}>
                    {assignedIndex === item.index && (
                        <FeatherIcon icon="check" />
                    )}
                    {item.display}
                </ContentBox>
            ))}
        </CreateSimpleBox>
    )
}

export default SimpleAssigned
