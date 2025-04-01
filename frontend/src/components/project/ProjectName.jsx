import { Link } from "react-router-dom"

import styled, { useTheme } from "styled-components"

import { ifMobile } from "@utils/useScreenType"

import { getPaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const ProjectName = ({ project, demo = false }) => {
    const { t } = useTranslation("translation", { keyPrefix: "project_list" })
    const theme = useTheme()

    const projectLink = `/app/projects/${project.id}`

    let nameParts = (
        <Link to={projectLink}>
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
                    fill={getPaletteColor(theme.type, project.color)}
                />
                {nameParts}
                <TypeText>
                    {project.type === "regular" && t("type_regular")}
                    {project.type === "goal" && t("type_goal")}
                </TypeText>
            </FlexBox>
            {!demo && (
                <TaskCountBox>
                    <CircleIcon>
                        <FeatherIcon icon="check" />
                    </CircleIcon>
                    <TaskCountText>
                        {project.completed_task_count}
                    </TaskCountText>
                    <CircleIcon />
                    <TaskCountText>
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
    color: ${(p) => p.theme.secondTextColor};
`

const TaskCountText = styled.div`
    font-size: 1em;
    color: ${(p) => p.theme.textColor};
`

const CircleIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1em;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 2px solid ${(p) => p.theme.secondTextColor};
    margin-left: 1em;
    margin-right: 0.3em;

    & svg {
        width: 0.8em;
        height: 0.8em;
        stroke: ${(p) => p.theme.secondTextColor};
        stroke-width: 0.2em;
        top: 0;
        margin-top: 0.1rem;
        margin-right: 0;
    }
`

export default ProjectName
