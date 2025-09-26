import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
} from "react"

import {
    ContentBox,
    CreateSimpleBox,
} from "@components/project/taskCreateSimple/CreateSimpleBox"

import FeatherIcon from "feather-icons-react"
import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"

const SimplePriority = ({
    priorityIndex,
    setPriorityIndex,
    color,
}: {
    priorityIndex: number
    setPriorityIndex: Dispatch<SetStateAction<number>>
    color: string
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task.priority" })

    const onKeyDown = useCallback(
        (e: KeyboardEvent | React.KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                if (priorityIndex === 2) return
                setPriorityIndex(priorityIndex + 1)
            }
            if (e.key === "ArrowLeft") {
                if (priorityIndex === 0) return
                setPriorityIndex(priorityIndex - 1)
            }
        },
        [priorityIndex, setPriorityIndex],
    )

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown)

        return () => {
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [priorityIndex, onKeyDown])

    const items = useMemo(() => makePriorityItems(t), [t])

    return (
        <div onKeyDown={onKeyDown}>
            <CreateSimpleBox icon={<FeatherIcon icon="alert-circle" />}>
                {items.map((item, index) => (
                    <ContentBox
                        key={item}
                        $color={color}
                        $isActive={priorityIndex === index}
                        onClick={() => setPriorityIndex(index)}>
                        {priorityIndex === index && (
                            <FeatherIcon icon="check" />
                        )}
                        {item}
                    </ContentBox>
                ))}
            </CreateSimpleBox>
        </div>
    )
}

const makePriorityItems = (t: TFunction<"translation", "task.priority">) => [
    t("normal"),
    t("important"),
    t("critical"),
]

export default SimplePriority
