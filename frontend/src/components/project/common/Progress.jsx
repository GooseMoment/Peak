import styled from "styled-components"

import BarChart from "@components/project/common/BarChart"

import { useTranslation } from "react-i18next"

const Progress = ({ project, drawers }) => {
    const { t } = useTranslation(null, { keyPrefix: "project" })

    let projectTaskCount = project.completed_task_count + project.uncompleted_task_count

    const isCompleted = () => {
        let totalUncompletedTaskCount = 0
        for (let i = 0; i < drawers.length; i++) {
            totalUncompletedTaskCount += drawers[i].uncompleted_task_count
        }

        return totalUncompletedTaskCount === 0
    }

    const getDisplayDrawersCount = () => {
        let count = 0

        for (let i = 0; i < drawers.length; i++) {
            if (drawers[i].completed_task_count + drawers[i].uncompleted_task_count !== 0)
                count += 1
            else
                return count
        }
        return count !== 0 && count - 1
    }

    const calculatePercent = (ratio, base) => {
        if (base === 0) return 0

        let calculated = Math.floor((ratio / base) * 100)

        if (isNaN(calculated)) return 0
        return calculated
    }

    return (
        <FlexColumnBox>
            {projectTaskCount === 0 ? null : (
                <>
                    <Text>{t("progress")}</Text>
                    <FlexBox>
                        <BarChart
                            isCompleted={isCompleted()}
                            color={project.color}
                            drawers={drawers}
                            projectTaskCount={projectTaskCount}
                            displayDrawersCount={getDisplayDrawersCount()}
                            calculatePercent={calculatePercent}
                        />
                    </FlexBox>
                </>
            )}
        </FlexColumnBox>
    )
}

const FlexColumnBox = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1em 0em;
`

const FlexBox = styled.div`
    display: flex;
    gap: 0.3em;
`

const Text = styled.div`
    color: ${(p) => p.theme.textColor};
    font-size: 1.1em;
    font-weight: 500;
`

export default Progress
