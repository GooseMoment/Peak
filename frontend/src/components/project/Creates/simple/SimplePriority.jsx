import { useEffect, useState } from "react"

import FeatherIcon from "feather-icons-react"

import { CreateSimpleBox, ContentBox } from "@components/project/Creates/simple/CreateSimpleBox"

import { useTranslation } from "react-i18next"

const SimplePriority = ({ editNewTask, color }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.priority" })

    const [currentIndex, setCurrentIndex] = useState(0)

    const onKeyDown = (e) => {
        if (e.key === "ArrowRight") {
            if (currentIndex === 2)
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
        editNewTask({ priority: currentIndex});
    }, [currentIndex])

    const items = [
        { index: 0, content: t("normal") },
        { index: 1, content: t("important") },
        { index: 2, content: t("critical") },
    ]

    return (
        <CreateSimpleBox onKeyDown={onKeyDown} icon={<FeatherIcon icon="alert-circle"/>}>
            {items.map(item=>(
                <ContentBox 
                    key={item.index} 
                    $color={color}
                    $isActive={currentIndex === item.index} 
                    onClick={()=>setCurrentIndex(item.index)}
                    tabIndex="0"
                >
                    {currentIndex === item.index && <FeatherIcon icon="check"/>}
                    {item.content}
                </ContentBox>
            ))}
        </CreateSimpleBox>
    )
}

export default SimplePriority
