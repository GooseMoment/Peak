import { Link } from "react-router-dom"

import styled, { useTheme } from "styled-components"

import { getProjectColor } from "@components/project/common/palettes"

import { ifMobile } from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const ProjectName = ({ project, demo = false }) => {
    const { t } = useTranslation(null, { keyPrefix: "project_list" })
    const theme = useTheme()

    let nameParts = (
        <Link to={`/app/projects/${project.id}`}>
            <NameText>{project.name}</NameText>
        </Link>
    )

    if (demo) {
        nameParts = <NameText>{project.name}</NameText>
    }

    return (
        <Box>
            <FlexBox>
                <FeatherIcon
                    icon="circle"
                    fill={getProjectColor(theme.type, project.color)}
                />
                {nameParts}
                <TypeText>
                    {project.type === "regular" && t("type_regular")}
                    {project.type === "goal" && t("type_goal")}
                </TypeText>
            </FlexBox>
            {!demo && (
                <TaskCountBox>
                    <TaskCountText>
                        {t("completed_tasks")}: {project.completed_task_count} /{" "}
                        {t("uncompleted_tasks")}:{" "}
                        {project.uncompleted_task_count}
                    </TaskCountText>
                </TaskCountBox>
            )}
        </Box>
    )
}

const Box = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.8em 0em;

    ${ifMobile} {
        flex-direction: column;
        align-items: flex-start;
    }
`

const FlexBox = styled.div`
    display: flex;
    align-items: center;

    & svg {
        width: 1.5em;
        height: 1.5em;
        stroke: none;
        top: 0;
    }
`

const TaskCountBox = styled.div`
    display: flex;
    align-items: center;
    margin: 1em 0em;

    & svg {
        width: 1.5em;
        height: 1.5em;
        stroke: none;
        top: 0;
    }
`

const NameText = styled.div`
    max-width: 10em;
    font-weight: normal;
    font-size: 1.25em;
    margin-left: 0.1em;
    color: ${(p) => p.theme.textColor};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3em;

    &:hover {
        color: #ff4a03;
        cursor: pointer;
    }
`

const TypeText = styled.div`
    font-weight: normal;
    font-size: 1em;
    margin-left: 0.6em;
    margin-top: 0.1em;
    color: ${(p) => p.theme.grey};
`

const TaskCountText = styled.div`
    font-size: 1em;
    color: ${(p) => p.theme.textColor};
`

export default ProjectName
