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

const SimpleAssigned = ({
    assignedIndex,
    setAssignedIndex,
    color,
}: {
    assignedIndex: number
    setAssignedIndex: Dispatch<SetStateAction<number>>
    color: string
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task.due.quick" })

    const onKeyDown = useCallback(
        (e: KeyboardEvent | React.KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                if (assignedIndex === 5) return
                setAssignedIndex(assignedIndex + 1)
            }
            if (e.key === "ArrowLeft") {
                if (assignedIndex === 0) return
                setAssignedIndex(assignedIndex - 1)
            }
        },
        [assignedIndex, setAssignedIndex],
    )

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown)

        return () => {
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [assignedIndex, onKeyDown])

    const items = useMemo(() => makeAssignedItems(t), [t])

    return (
        <div onKeyDown={onKeyDown}>
            <CreateSimpleBox icon={<FeatherIcon icon="calendar" />}>
                {items.map((item, index) => (
                    <ContentBox
                        key={index}
                        $color={color}
                        $isActive={assignedIndex === index}
                        onClick={() => setAssignedIndex(index)}>
                        {assignedIndex === index && (
                            <FeatherIcon icon="check" />
                        )}
                        {item}
                    </ContentBox>
                ))}
            </CreateSimpleBox>
        </div>
    )
}

const makeAssignedItems = (t: TFunction<"translation", "task.due.quick">) => [
    t("no_date"),
    t("today"),
    t("tomorrow"),
    t("next_week"),
    t("next_two_weeks"),
    t("next_month"),
]

export default SimpleAssigned
