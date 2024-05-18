import { Link, useRouteLoaderData } from "react-router-dom"
import { useState } from "react"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import ModalPortal from "@components/common/ModalPortal"
import ProjectCreate from "@components/project/Creates/ProjectCreate"

import { useTranslation } from "react-i18next"

const ProjectListPage = () => {
    const { t } = useTranslation(null, {keyPrefix: "project_list"})

    const {projects} = useRouteLoaderData("app")
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    return(
        <>
            <TitleText>{t("title")}</TitleText>
            {projects && projects.map((project) => (
                <Box key={project.id}>
                    <FlexBox>
                        <FeatherIcon icon="circle" fill={`#`+ project.color}/>
                        <Link to={`/app/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                            <NameText>{project.name}</NameText>
                        </Link>
                        <TypeText>{project.type === 'regular' ? t("type_regular") : t("type_goal")}</TypeText>
                    </FlexBox>
                    <FlexBox>
                        <Text>{t("completed_tasks")}: 30 / {t("uncompleted_tasks")}: 40</Text>
                    </FlexBox>
                </Box>
            ))}
            <TaskCreateButton onClick={() => {setIsCreateOpen(true)}}>
                <FeatherIcon icon="plus-circle"/>
                <TaskCreateText>{t("button_add_project")}</TaskCreateText>
            </TaskCreateButton>
            { isCreateOpen &&
            <ModalPortal closeModal={() => {setIsCreateOpen(false)}}>
                <ProjectCreate onClose={() => {setIsCreateOpen(false)}}/>
            </ModalPortal>}
        </>
    )
}

const TitleText = styled.div`
    font-size: 2em;
    font-weight: bolder;
    margin-bottom: 1em;
    color: #000000;
`

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

const TaskCreateButton = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    padding: 1.3em 0em;
    margin-left: 1.2em;
    
    &:hover {
        cursor: pointer;
    }

    & svg {
        text-align: center;
        width: 1.1em;
        height: 1.1em;
        top: 0;
    } 
`

const TaskCreateText = styled.div`
    font-size: 1em;
    font-weight: medium;
    color: #000000;
    margin-top: 0em;
`

export default ProjectListPage