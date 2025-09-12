import { useQuery } from "@tanstack/react-query"

import Module, { Title } from "@components/home/Module"
import VGraph, { VGraphSkeleton } from "@components/home/VGraph"

import { getTasksTodayAssignedGrouped } from "@api/today.api"

import { useTranslation } from "react-i18next"

const AssignedToday = () => {
    const { data, isPending, isError } = useQuery({
        queryKey: ["home", "tasks", "today"],
        queryFn: () => getTasksTodayAssignedGrouped(),
    })

    const { t } = useTranslation("home", { keyPrefix: "assigned_today" })

    if (isPending) {
        return (
            <Module>
                <Title loading />
                <VGraphSkeleton />
            </Module>
        )
    }

    if (isError) {
        return null
    }

    return (
        <Module>
            <Title to="/app/today">
                {t("title", { number: data.countAll })}
            </Title>
            <VGraph items={data.items} countAll={data.countAll} />
        </Module>
    )
}

export default AssignedToday
