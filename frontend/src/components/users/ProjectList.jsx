import { Link } from "react-router-dom"
import { Section, SectionTitle } from "@components/users/Section"

import { skeletonCSS } from "@assets/skeleton"

import styled, { css } from "styled-components"
import { useTranslation } from "react-i18next"

const ProjectList = ({projects, isMine, isPending}) => {
    const { t } = useTranslation(null, {keyPrefix: "users"})

    return <Section>
        <SectionTitle>{t("projects")}</SectionTitle>

        <Projects>
            {isPending && [...Array(10)].map((_, i) => <Project key={i} $skeleton />)}

            {projects?.map(project => {
                const projectCompo = <Project key={project.id}>
                    <Circle $color={"#" + project.color} /> <Name>{project.name}</Name> 
                </Project>

                if (!isMine) {
                    return projectCompo
                }

                return <Link to={isMine && `/app/projects/${project.id}`} key={project.id}>
                    {projectCompo}
                </Link>
            })}

            {projects?.length === 0 && t("projects_nothing")}
        </Projects>
    </Section>
}

const Projects = styled.div`
    display: flex;
    gap: 1.5em;
    margin-top: 1.5em;
    margin-left: 1.25em;

    flex-wrap: wrap;
`

const Project = styled.div`
    display: flex;
    gap: 0.25em;
    font-size: 1.25em;
    align-items: center;

    ${p => p.$skeleton && css`
        height: 1.25em;
        width: 5em;
        border-radius: 8px;

        ${skeletonCSS}    
    `}
`

const Circle = styled.div`
    border-radius: 50%;
    background-color: ${p => p.$color};

    aspect-ratio: 1/1;
    height: 1em;
`

const Name = styled.div`
    word-break: keep-all;
`

export default ProjectList
