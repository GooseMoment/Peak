import { useEffect, useState } from "react"

import FeatherIcon from "feather-icons-react"

import { CreateSimpleBox, ContentBox } from "@components/project/Creates/simple/CreateSimpleBox"
import calculateDate from "@components/project/Creates/utils/calculateDate"

import hourglass from "@assets/project/hourglass.svg"

import { useTranslation } from "react-i18next"

const SimpleDue = ({ editNewTask }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.due.quick" })

    const [currentIndex, setCurrentIndex] = useState(0)

    const onKeyDown = (e) => {
        if (e.key === "ArrowRight") {
            if (currentIndex === 5)
                return
            setCurrentIndex(currentIndex + 1)
        }
        if (e.key === "ArrowLeft") {
            if (currentIndex === 0)
                return
            setCurrentIndex(currentIndex - 1)
        }
    }

    useEffect(() => {
        editNewTask({ due_date: calculateDate(items[currentIndex].set)})
    }, [currentIndex])

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
        <CreateSimpleBox onKeyDown={onKeyDown} icon={<img src={hourglass} />}>
            {items.map(item=>(
                <ContentBox 
                    key={item.index} 
                    $isActive={currentIndex === item.index} 
                    onClick={()=>setCurrentIndex(item.index)}
                    tabIndex="0"
                >
                    {currentIndex === item.index && <FeatherIcon icon="check"/>}
                    {item.display}
                </ContentBox>
            ))}
        </CreateSimpleBox>
    )
}

export default SimpleDue
