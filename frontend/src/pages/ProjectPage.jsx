import { useLoaderData, useParams } from "react-router-dom"
import { useState } from "react";

import Drawer from "@components/project/Drawer"
import TaskCreateSimple from "@components/project/TaskCreate/TaskCreateSimple"

import styled from "styled-components";
import FeatherIcon from "feather-icons-react";

const ProjectPage = () => {
    const { id } = useParams()
    const project = useLoaderData()
    const drawers = project.drawers

    const [isSimpleOpen, setIsSimpleOpen] = useState(false)

    const handleisSimpleOpen = () => {
        setIsSimpleOpen(prev => !prev)
    }

    return (
    <>
        <TitleBox>
            <TitleName $color = {project.color}>{project.name}</TitleName>
            <FeatherIcon icon="more-horizontal"/>
        </TitleBox>
        {drawers && drawers.map((drawer) => (
            <Drawer key={drawer.id} id={id} drawer={drawer} color={project.color}/>
        ))}
        { isSimpleOpen &&
            <TaskCreateSimple />
        }
        <TaskCreateButton onClick={handleisSimpleOpen}>
            <FeatherIcon icon="plus-circle"/>
            <TaskCreateText>할 일 추가</TaskCreateText>
        </TaskCreateButton>
    </>
    )
}

const TitleBox = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const TitleName = styled.h1`
    font-size: 2em;
    font-weight: bolder;
    text-align: left;
    color: #${props => props.$color};
`

const TaskCreateButton = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    vertical-align: center;
    text-align: middle;
    margin-left: 1.3em;
    margin-top: 1.3em;
    
    &:hover {
        cursor: pointer;
    }

    & svg {
        text-align: center;
        width: 1.3em;
        height: 1.3em;
        top: 0;
    } 
`

const TaskCreateText = styled.div`
    text-align: center;
    font-size: 1.1em;
    font-weight: medium;
    color: #000000;
    margin-top: 0em;
`

export default ProjectPage