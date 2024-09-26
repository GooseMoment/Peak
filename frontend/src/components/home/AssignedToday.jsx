import { useQuery } from "@tanstack/react-query"

import Module, { Title } from "@components/home/Module"
import VGraph from "@components/home/VGraph"

import { getTodayTasksGroupedByProject } from "@api/tasks.api"

const AssignedToday = () => {
    const { data, isFetching } = useQuery({
        queryKey: ["home", "tasks", "today"],
        queryFn: () => getTodayTasksGroupedByProject(),
    })

    if (isFetching) {
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
