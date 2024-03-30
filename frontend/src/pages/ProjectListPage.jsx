import { useRouteLoaderData } from "react-router-dom"
import { useState } from "react"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import ModalPortal from "@components/common/ModalPortal"
import ProjectCreate from "@/components/project/Creates/ProjectCreate"

const ProjectListPage = () => {
    const {projects} = useRouteLoaderData("app")
    const [isCreateOpen, setsIsCreateOpen] = useState(false)

    return(
        <>
            {projects && projects.map((project) => (
                <FlexBox>
                    <FeatherIcon icon="circle" fill={`#`+ project.color}/>
                    <div>{project.name}</div>
                </FlexBox>
            ))}
            <TaskCreateButton onClick={() => {setsIsCreateOpen(true)}}>
                <FeatherIcon icon="plus-circle"/>
                <TaskCreateText>프로젝트 추가</TaskCreateText>
            </TaskCreateButton>
            { isCreateOpen &&
            <ModalPortal closeModal={() => {setsIsCreateOpen(false)}}>
                <ProjectCreate onClose={() => {setsIsCreateOpen(false)}}/>
            </ModalPortal>}
        </>
    )
}

const FlexBox = styled.div`
    display: flex;
`

const TaskCreateButton = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    margin-left: 1.3em;
    margin-top: 1.3em;
    
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