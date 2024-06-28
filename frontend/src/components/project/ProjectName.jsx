import { Link } from "react-router-dom"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const ProjectName = ({project, activateLink=false}) => {
    const { t } = useTranslation(null, {keyPrefix: "project_list"})

    let nameParts = <NameText>{project.name}</NameText>

    if (activateLink) {
        nameParts = <Link to={`/app/projects/${project.id}`} style={{ textDecoration: 'none' }}>
            <NameText>{project.name}</NameText>
        </Link>
    }

    return <Box>
        <FlexBox>
            <FeatherIcon icon="circle" fill={`#`+ project.color}/>
            {nameParts}
            <TypeText>{project.type === 'regular' ? t("type_regular") : t("type_goal")}</TypeText>
        </FlexBox>
        <FlexBox>
            <Text>{t("completed_tasks")}: {project.completed_task_count} / {t("uncompleted_tasks")}: {project.uncompleted_task_count}</Text>
        </FlexBox>
    </Box>
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
    color: #000000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        color: #FF4A03;
        cursor: pointer;
    }
`

const TypeText = styled.div`
    font-weight: normal;
    font-size: 1em;
    margin-left: 0.6em;
    color: #6E6E6E;
`

const Text = styled.div`
    font-size: 1em;
    color: #000000;
`

export default ProjectName
