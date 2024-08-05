import { useState } from "react"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import PageTitle from "@components/common/PageTitle"
import ProjectName from "@components/project/ProjectName"
import ModalPortal from "@components/common/ModalPortal"
import ProjectCreate from "@components/project/Creates/ProjectCreate"
import SkeletonProjectList from "@components/project/skeletons/SkeletonProjectList" 

import { getProjectList } from "@api/projects.api"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import ErrorProjectList from "@/components/errors/ErrorProjectList"

const ProjectListPage = () => {
    const { t } = useTranslation(null, {keyPrefix: "project_list"})

    const { isPending, isError, data: projects, refetch } = useQuery({
        queryKey: ['projects'],
        queryFn: () => getProjectList(),
    })

    const [isCreateOpen, setIsCreateOpen] = useState(false)

    return(
        <>
            <PageTitle>{t("title")}</PageTitle>
            {isPending && <SkeletonProjectList/>}
            {projects?.map((project) => <ProjectName key={project.id} project={project} />)}
            {isPending || <TaskCreateButton onClick={() => {setIsCreateOpen(true)}}>
                <FeatherIcon icon="plus-circle"/>
                <TaskCreateText>{t("button_add_project")}</TaskCreateText>
            </TaskCreateButton>}
            { isCreateOpen &&
            <ModalPortal closeModal={() => {setIsCreateOpen(false)}}>
                <ProjectCreate onClose={() => {setIsCreateOpen(false)}}/>
            </ModalPortal>}
        </>
    )
}

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
    color: ${p => p.theme.textColor};
    margin-top: 0em;
`

export default ProjectListPage