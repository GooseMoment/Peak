import { useState } from "react"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import ModalWindow from "@components/common/ModalWindow"
import PageTitle from "@components/common/PageTitle"
import ErrorProjectList from "@components/errors/ErrorProjectList"
import ProjectName from "@components/project/ProjectName"
import ProjectEdit from "@components/project/edit/ProjectEdit"
import SkeletonProjectList from "@components/project/skeletons/SkeletonProjectList"

import { getProjectList } from "@api/projects.api"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const ProjectListPage = () => {
    const { t } = useTranslation(null, { keyPrefix: "project_list" })

    const {
        isPending,
        isError,
        data: projects,
        refetch,
    } = useQuery({
        queryKey: ["projects"],
        queryFn: () => getProjectList(),
    })

    const [isCreateOpen, setIsCreateOpen] = useState(false)

    return (
        <>
            <PageTitleBox>
                <PageTitle>{t("title")}</PageTitle>
                {isPending || <PlusBox onClick={() => {setIsCreateOpen(true)}}><FeatherIcon icon="plus"/></PlusBox>}
            </PageTitleBox>

            {isPending && <SkeletonProjectList />}
            {isError && <ErrorProjectList onClick={() => refetch()} />}

            {projects?.map((project) => (
                <ProjectName key={project.id} project={project} />
            ))}
            {isPending || (
                <ProjectCreateButton
                    onClick={() => {
                        setIsCreateOpen(true)
                    }}>
                    <FeatherIcon icon="plus-circle" />
                    <ProjectCreateText>
                        {t("button_add_project")}
                    </ProjectCreateText>
                </ProjectCreateButton>
            )}
            {isCreateOpen && (
                <ModalWindow
                    afterClose={() => {
                        setIsCreateOpen(false)
                    }}>
                    <ProjectEdit isCreating />
                </ModalWindow>
            )}
        </>
    )
}

const PageTitleBox = styled.div`
    display: flex;
    align-items: center;
`

const PlusBox = styled.div`
    margin-left: 0.8em;
    padding-bottom: 0.8em;
    cursor: pointer;

    & svg {
        width: 16px;
        height: 16px;
        top: 0;
    }
`

const ProjectCreateButton = styled.div`
    display: flex;
    align-items: center;
    padding: 1.3em 0em;
    margin-left: 1.2em;
    cursor: pointer;

    & svg {
        width: 1.1em;
        height: 1.1em;
        top: 0;
    }
`

const ProjectCreateText = styled.div`
    font-size: 1em;
    font-weight: medium;
    color: ${(p) => p.theme.textColor};
    margin-top: 0em;
`

export default ProjectListPage
