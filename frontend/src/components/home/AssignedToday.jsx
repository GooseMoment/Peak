import { useQuery } from "@tanstack/react-query"

import Module, { Title } from "@components/home/Module"
import VGraph from "@components/home/VGraph"

import { getTasksTodayAssignedGrouped } from "@api/today.api"

import { useClientTimezone } from "@utils/clientSettings"

const AssignedToday = () => {
    const tz = useClientTimezone()

    const { data, isLoading } = useQuery({
        queryKey: ["home", "tasks", "today"],
        queryFn: () => getTasksTodayAssignedGrouped(tz),
    })

    if (isLoading) {
        return (
            <Module>
                <Title loading />
                <VGraph loading />
            </Module>
        )
    }

    const { items, countAll } = data

    return (
        <Module>
            <Title to="/app/today">{countAll} tasks assigned today</Title>
            <VGraph items={items} countAll={countAll} />
        </Module>
    )
}

export default AssignedToday
