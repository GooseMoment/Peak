import { useEffect } from "react"

import FeatherIcon from "feather-icons-react"

import { CreateSimpleBox, ContentBox } from "@components/project/Creates/simple/CreateSimpleBox"
import addDateFromToday from "@components/project/Creates/utils/addDateFromToday"
import { useClientTimezone } from "@utils/clientSettings"

import hourglass from "@assets/project/hourglass.svg"

import { useTranslation } from "react-i18next"

const SimpleDue = ({ dueIndex, setDueIndex, editNewTask, color }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.due.quick" })
    const due_tz = useClientTimezone()

    const onKeyDown = (e) => {
        if (e.key === "ArrowRight") {
            if (dueIndex === 5)
                return
            setDueIndex(dueIndex + 1)
        }
        if (e.key === "ArrowLeft") {
            if (dueIndex === 0)
                return
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
        editNewTask({ due_tz: due_tz, due_date: addDateFromToday(items[dueIndex].set)})
    }, [dueIndex])

    const items = [
        { index: 0, display: t("no_date"), set: null },
        { index: 1, display: t("today"), set: 0 },
        { index: 2, display: t("tomorrow"), set: 1 },
        {
            index: 3,
            display: t("next_week"),
            set: 7,
        },
        {
            index: 4,
            display: t("next_two_weeks"),
            set: 14,
        },
        {
            index: 5,
            display: t("next_month"),
            set: 30,
        },
    ]

    return (
        <CreateSimpleBox icon={<img src={hourglass} />}>
            {items.map(item=>(
                <ContentBox 
                    key={item.index} 
                    $color={color}
                    $isActive={dueIndex === item.index} 
                    onClick={()=>setDueIndex(item.index)}
                >
                    {dueIndex === item.index && <FeatherIcon icon="check"/>}
                    {item.display}
                </ContentBox>
            ))}
        </CreateSimpleBox>
    )
}

export default SimpleDue
