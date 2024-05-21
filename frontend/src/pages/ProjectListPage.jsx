import { Link, useRouteLoaderData } from "react-router-dom"
import { useState } from "react"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import PageTitle from "@components/common/PageTitle"
import ModalPortal from "@components/common/ModalPortal"
import ProjectCreate from "@components/project/Creates/ProjectCreate"

const ProjectListPage = () => {
    const {projects} = useRouteLoaderData("app")
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    return(
        <>
            <PageTitle>프로젝트</PageTitle>
            {projects && projects.map((project) => (
                <Box key={project.id}>
                    <FlexBox>
                        <FeatherIcon icon="circle" fill={`#`+ project.color}/>
                        <Link to={`/app/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                            <NameText>{project.name}</NameText>
                        </Link>
                        <TypeText>{project.type === 'regular' ? "상시" : "목표"}</TypeText>
                    </FlexBox>
                    <FlexBox>
                        <Text>완수한 일 : 30 / 완수하지 못한 일 : 40</Text>
                    </FlexBox>
                </Box>
            ))}
            <TaskCreateButton onClick={() => {setIsCreateOpen(true)}}>
                <FeatherIcon icon="plus-circle"/>
                <TaskCreateText>프로젝트 추가</TaskCreateText>
            </TaskCreateButton>
            { isCreateOpen &&
            <ModalPortal closeModal={() => {setIsCreateOpen(false)}}>
                <ProjectCreate onClose={() => {setIsCreateOpen(false)}}/>
            </ModalPortal>}
        </>
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