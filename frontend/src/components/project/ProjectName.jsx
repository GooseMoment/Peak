import { Link } from "react-router-dom"

import styled, { useTheme } from "styled-components"

import { getProjectColor } from "@components/project/Creates/palettes"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const ProjectName = ({ project, demo = false }) => {
    const { t } = useTranslation(null, { keyPrefix: "project_list" })
    const theme = useTheme()

    let nameParts = (
        <Link
            to={`/app/projects/${project.id}`}
        >
            <NameText>{project.name}</NameText>
        </Link>
    )

    if (demo) {
        nameParts = <NameText>{project.name}</NameText>
    }

    return (
        <Box>
            <FlexBox>
                <FeatherIcon icon="circle" fill={getProjectColor(theme.type, project.color)} />
                {nameParts}
                <TypeText>
                    {project.type === "regular" && t("type_regular")}
                    {project.type === "goal" && t("type_goal")}
                </TypeText>
            </FlexBox>
            {!demo && (
                <FlexBox>
                    <Text>
                        {t("completed_tasks")}: {project.completed_task_count} /{" "}
                        {t("uncompleted_tasks")}:{" "}
                        {project.uncompleted_task_count}
                    </Text>
                </FlexBox>
            )}
        </Box>
    )
}

const Box = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 3.7em;
`

const FlexBox = styled.div`
    display: flex;
    align-items: center;
    margin: 1em 0.5em;

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
    margin-left: 0.3em;
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

const Text = styled.div`
    font-size: 1em;
    color: ${(p) => p.theme.textColor};
`

export default ProjectName
