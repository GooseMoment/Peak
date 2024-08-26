import { useEffect } from "react"

import FeatherIcon from "feather-icons-react"

import { CreateSimpleBox, ContentBox } from "@components/project/Creates/simple/CreateSimpleBox"

import { useTranslation } from "react-i18next"

const SimplePriority = ({ priorityIndex, setPriorityIndex, editNewTask, color }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.priority" })

    const onKeyDown = (e) => {
        if (e.key === "ArrowRight") {
            if (priorityIndex === 2)
                return
            setPriorityIndex(priorityIndex + 1)
        }
        if (e.key === "ArrowLeft") {
            if (priorityIndex === 0)
                return
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
        <CreateSimpleBox icon={<FeatherIcon icon="alert-circle"/>}>
            {items.map(item=>(
                <ContentBox 
                    key={item.index}
                    $color={color}
                    $isActive={priorityIndex === item.index} 
                    onClick={()=>setPriorityIndex(item.index)}
                >
                    {priorityIndex === item.index && <FeatherIcon icon="check"/>}
                    {item.content}
                </ContentBox>
            ))}
        </CreateSimpleBox>
    )
}

export default SimplePriority
