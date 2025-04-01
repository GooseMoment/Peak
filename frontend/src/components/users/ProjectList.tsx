import { Link } from "react-router-dom"

import styled, { css, useTheme } from "styled-components"

import { Section, SectionTitle } from "@components/users/Section"

import { ifMobile } from "@utils/useScreenType"

import { type PaletteColorName, getPaletteColor } from "@assets/palettes"
import { skeletonCSS } from "@assets/skeleton"

import { useTranslation } from "react-i18next"

interface ProjectListProp {
    projects: { id: string; name: string; color: PaletteColorName }[] // TODO: replace to Project
    isMine?: boolean
    isLoading?: boolean
}

const ProjectList = ({
    projects,
    isMine = false,
    isLoading = false,
}: ProjectListProp) => {
    const { t } = useTranslation("translation", { keyPrefix: "users" })
    const theme = useTheme()

    return (
        <Section>
            <SectionTitle>{t("projects")}</SectionTitle>

            <Projects>
                {isLoading &&
                    [...Array(10)].map((_, i) => <Project key={i} $loading />)}

                {projects?.map((project) => {
                    const projectName = (
                        <Project key={project.id}>
                            <Circle
                                $color={getPaletteColor(
                                    theme.type,
                                    project.color,
                                )}
                            />{" "}
                            <Name>{project.name}</Name>
                        </Project>
                    )

                    if (!isMine) {
                        return projectName
                    }

                    return (
                        <Link
                            to={isMine && `/app/projects/${project.id}`}
                            key={project.id}>
                            {projectName}
                        </Link>
                    )
                })}

                {projects?.length === 0 && t("projects_empty")}
            </Projects>
        </Section>
    )
}

const Projects = styled.div`
    display: flex;
    gap: 1.5em;
    margin-top: 1.5em;
    margin-left: 1.25em;

    flex-wrap: wrap;

    ${ifMobile} {
        margin-left: 0;
    }
`

const Project = styled.div<{ $loading?: boolean }>`
    display: flex;
    gap: 0.25em;
    font-size: 1.25em;
    align-items: center;

    ${(p) =>
        p.$loading &&
        css`
            height: 1.25em;
            width: 5em;
            border-radius: 8px;

            ${skeletonCSS()}
        `}
`

const Circle = styled.div<{ $color: string }>`
    border-radius: 50%;
    background-color: ${(p) => p.$color};

    aspect-ratio: 1/1;
    height: 1em;
`

const Name = styled.div`
    word-break: keep-all;
`

export default ProjectList
