import { Outlet, useParams } from "react-router-dom"
import { useState } from "react"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import PageTitle from "@components/common/PageTitle"
import Drawer from "@components/drawers/Drawer"
import DrawerCreate from "@components/project/Creates/DrawerCreate"
import ModalPortal from "@components/common/ModalPortal"
import { useMutation } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import { getProject, patchProject } from "@api/projects.api"

const ProjectPage = () => {
    const { id } = useParams()
    
    const { isPending, isError, data: project, error } = useQuery({
        queryKey: ['projects', id],
        queryFn: () => getProject(id),
    })

    const patchMutation = useMutation({
        mutationFn: (data) => {
            return patchProject(id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['projects', id]})
            queryClient.invalidateQueries({queryKey: ['projects']})
        },
    }) // 수정 만드셈

    const { t } = useTranslation(null, {keyPrefix: "project"})

    const [isDrawerCreateOpen, setIsDrawerCreateOpen] = useState(false)

    if (isPending) {
        return <div>로딩중...</div>
        // 민영아.. 스켈레톤 뭐시기 만들어..
    }

    const drawers = project.drawers

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
        {isDrawerCreateOpen &&
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