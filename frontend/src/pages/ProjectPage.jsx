import { Outlet, useLoaderData, useParams } from "react-router-dom"
import { useState } from "react"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import PageTitle from "@components/common/PageTitle"
import Drawer from "@components/project/Drawer"
import DrawerCreate from "@components/project/Creates/DrawerCreate"
import ModalPortal from "@components/common/ModalPortal"
import { useTranslation } from "react-i18next"

const ProjectPage = () => {
    const { id } = useParams()
    const { project } = useLoaderData()
    const drawers = project.drawers

    const { t } = useTranslation(null, {keyPrefix: "project"})

    const [isDrawerCreateOpen, setIsDrawerCreateOpen] = useState(false)

    return (
    <>
        <TitleBox>
            <PageTitle $color={"#" + project.color}>{project.name}</PageTitle>
            <Icons>
                <FeatherIcon icon="plus" onClick={() => {setIsDrawerCreateOpen(true)}}/>
                <FeatherIcon icon="more-horizontal"/>
            </Icons>
        </TitleBox>
        {drawers && (drawers.length === 0) ? <NoDrawerText>{t("no_drawer")}</NoDrawerText> 
        : drawers.map((drawer) => (
            <Drawer key={drawer.id} project={project} drawer={drawer} color={project.color}/>
        ))}
        { isDrawerCreateOpen &&
            <ModalPortal closeModal={() => {setIsDrawerCreateOpen(false)}}>
                <DrawerCreate onClose={() => {setIsDrawerCreateOpen(false)}}/>
            </ModalPortal>}
        <Outlet context={[id, project.color]} />
    </>
    )
}

const TitleBox = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const Icons = styled.div`
    display: flex;
    align-items: center;

    & svg {
        cursor: pointer;
        margin-left: 1em;
    }
`

const NoDrawerText = styled.div`
    margin-top: 2em;
    font-weight: 600;
    font-size: 1.4em;
`

export default ProjectPage