import { useLoaderData, useParams } from "react-router-dom"
import { useState } from "react";

import styled from "styled-components";
import FeatherIcon from "feather-icons-react";

import Drawer from "@components/project/Drawer"
import DrawerCreate from "@components/project/Creates/DrawerCreate";
import ModalPortal from "@components/common/ModalPortal";

const ProjectPage = () => {
    const { id } = useParams()
    const project = useLoaderData()
    const drawers = project.drawers

    const [isDrawerCreateOpen, setisDrawerCreateOpen] = useState(false)

    return (
    <>
        <TitleBox>
            <TitleName $color = {project.color}>{project.name}</TitleName>
            <Icons>
                <FeatherIcon icon="plus" onClick={() => {setisDrawerCreateOpen(true)}}/>
                <FeatherIcon icon="more-horizontal"/>
            </Icons>
        </TitleBox>
        {drawers && drawers.map((drawer) => (
            <Drawer key={drawer.id} projectId={id} drawer={drawer} color={project.color}/>
        ))}
        { isDrawerCreateOpen &&
            <ModalPortal closeModal={() => {setisDrawerCreateOpen(false)}}>
                <DrawerCreate onClose={() => {setisDrawerCreateOpen(false)}}/>
            </ModalPortal>}
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

const Icons = styled.div`
    display: flex;
    align-items: center;

    & svg {
        cursor: pointer;
        margin-left: 1em;
    }
`

export default ProjectPage