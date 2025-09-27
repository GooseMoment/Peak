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

import Hourglass from "@assets/project/Hourglass"

import FeatherIcon from "feather-icons-react"
import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"

const SimpleDue = ({
    dueIndex,
    setDueIndex,
    color,
}: {
    dueIndex: number
    setDueIndex: Dispatch<SetStateAction<number>>
    color: string
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task.due.quick" })

    const onKeyDown = useCallback(
        (e: KeyboardEvent | React.KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                if (dueIndex === 5) return
                setDueIndex(dueIndex + 1)
            }
            if (e.key === "ArrowLeft") {
                if (dueIndex === 0) return
                setDueIndex(dueIndex - 1)
            }
        },
        [dueIndex, setDueIndex],
    )

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown)

        return () => {
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [dueIndex, onKeyDown])

    const items = useMemo(() => makeDueItems(t), [t])

    return (
        <div onKeyDown={onKeyDown}>
            <CreateSimpleBox icon={<Hourglass />}>
                {items.map((item, index) => (
                    <ContentBox
                        key={index}
                        $color={color}
                        $isActive={dueIndex === index}
                        onClick={() => setDueIndex(index)}>
                        {dueIndex === index && <FeatherIcon icon="check" />}
                        {item}
                    </ContentBox>
                ))}
            </CreateSimpleBox>
        </div>
    )
}

const makeDueItems = (t: TFunction<"translation", "task.due.quick">) => [
    t("no_date"),
    t("today"),
    t("tomorrow"),
    t("next_week"),
    t("next_two_weeks"),
    t("next_month"),
]

export default SimpleDue
