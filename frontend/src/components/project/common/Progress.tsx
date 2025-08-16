import styled, { useTheme } from "styled-components"

import BarChart from "@components/project/common/BarChart"

import { type Drawer } from "@api/drawers.api"
import { type Project } from "@api/projects.api"

import { getPaletteColor } from "@assets/palettes"

import { useTranslation } from "react-i18next"

const Progress = ({
    project,
    drawers,
}: {
    project: Project
    drawers: Drawer[]
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "project" })
    const theme = useTheme()

    const projectTaskCount =
        project.completed_task_count + project.uncompleted_task_count

    if (projectTaskCount === 0) {
        return null
    }

    const isCompleted = () => {
        let totalUncompletedTaskCount = 0
        for (let i = 0; i < drawers.length; i++) {
            totalUncompletedTaskCount += drawers[i].uncompleted_task_count
        }

        return totalUncompletedTaskCount === 0
    }

    return (
        <FlexColumnBox>
            <Text>{t("progress")}</Text>
            <FlexBox>
                <BarChart
                    isCompleted={isCompleted()}
                    color={getPaletteColor(theme.type, project.color)}
                    drawers={drawers}
                    projectTaskCount={projectTaskCount}
                />
            </FlexBox>
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
